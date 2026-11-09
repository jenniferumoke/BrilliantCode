// Central security guards for the Electron main process.
//
// Why this module exists
// ----------------------
// Several BrilliantCode windows load our preload script, which exposes powerful
// APIs to the page (terminal/pty, file read/write, agent controls). Any page that
// ends up running inside one of those webContents effectively has local code
// execution. The guards here make sure that only our own bundled UI ever runs
// with those APIs:
//
//   * window.open / target=_blank from any app window is denied. By default
//     Electron creates the popup with the opener's webPreferences — including
//     the preload — so an attacker-controlled link could otherwise open a page
//     that can call `window.pty.write(...)`. Safe http(s) links are handed to
//     the user's real browser instead.
//   * Renderer-initiated navigation of privileged windows is blocked, for the
//     same reason (a link or script must not be able to replace our UI with a
//     remote page while the preload stays attached).
//   * <webview> guests are forced into a locked-down configuration: no preload,
//     no Node, context isolation and sandbox on, and only web/file schemes.
//   * shell.openExternal is only ever called with http(s)/mailto URLs, and
//     shell.openPath refuses to "open" (i.e. execute) programs and scripts.

import { app, shell } from 'electron';
import type { WebContents } from 'electron';
import * as path from 'node:path';
import * as fsSync from 'node:fs';

const EXTERNAL_URL_PROTOCOLS = new Set(['https:', 'http:', 'mailto:']);
const WEBVIEW_SRC_PROTOCOLS = new Set(['https:', 'http:', 'file:', 'about:']);

/** True when `raw` parses as a URL with a scheme that is safe to hand to the OS browser. */
export function isSafeExternalUrl(raw: unknown): raw is string {
  if (typeof raw !== 'string' || !raw.trim()) return false;
  try {
    const parsed = new URL(raw.trim());
    return EXTERNAL_URL_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * shell.openExternal, but only for http(s)/mailto. Other schemes (file:, smb:,
 * custom app protocols, ms-* handlers, …) can launch local programs and are
 * refused.
 */
export async function safeOpenExternal(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  if (!isSafeExternalUrl(raw)) {
    return { ok: false, error: 'Refused to open URL: only http(s) and mailto links are allowed.' };
  }
  await shell.openExternal(new URL(raw.trim()).toString());
  return { ok: true };
}

// Extensions that the OS will execute (or hand to an interpreter) when
// "opened". Opening these from a workspace would run code from whatever repo
// the user happens to have open, so we reveal them in the file manager instead.
const EXECUTABLE_EXTENSIONS = new Set([
  // macOS
  '.app', '.command', '.tool', '.terminal', '.workflow', '.action', '.scpt', '.scptd',
  '.applescript', '.pkg', '.mpkg', '.prefpane', '.webloc', '.inetloc', '.fileloc', '.osax',
  // Windows
  '.exe', '.com', '.bat', '.cmd', '.msi', '.msp', '.scr', '.pif', '.cpl', '.ps1', '.psm1',
  '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh', '.hta', '.lnk', '.url', '.reg', '.appref-ms',
  '.application', '.gadget', '.msc', '.jar', '.library-ms', '.search-ms', '.settingcontent-ms',
  // Linux / generic
  '.sh', '.bash', '.zsh', '.csh', '.ksh', '.fish', '.desktop', '.appimage', '.run', '.bin',
  '.py', '.pl', '.rb', '.php',
]);

/**
 * True when opening `absPath` with the OS default handler could execute it:
 * a known program/script extension, an app bundle directory, or (on POSIX) a
 * regular file with any execute bit set.
 */
export function isExecutableLike(absPath: string): boolean {
  const ext = path.extname(absPath).toLowerCase();
  if (EXECUTABLE_EXTENSIONS.has(ext)) return true;
  try {
    const stat = fsSync.statSync(absPath);
    if (stat.isFile() && process.platform !== 'win32' && (stat.mode & 0o111) !== 0) return true;
  } catch {
    // If we cannot stat it, err on the side of not executing it.
    return true;
  }
  return false;
}

/**
 * Open a local file with its default app, unless that would execute it; in
 * that case reveal it in Finder/Explorer so the user decides.
 */
export async function safeOpenPath(absPath: string): Promise<{ ok: boolean; revealed?: boolean; error?: string }> {
  if (isExecutableLike(absPath)) {
    shell.showItemInFolder(absPath);
    return { ok: true, revealed: true };
  }
  const result = await shell.openPath(absPath);
  if (typeof result === 'string' && result.trim()) return { ok: false, error: result.trim() };
  return { ok: true };
}

const privilegedContents = new WeakSet<WebContents>();

/**
 * Mark a webContents that loads our preload. Renderer-initiated navigations
 * away from the page main loaded are blocked; http(s) targets open in the
 * user's browser instead. (Navigations started from main via loadURL/loadFile
 * do not emit will-navigate and are unaffected.)
 */
export function lockDownPrivilegedContents(contents: WebContents): void {
  if (privilegedContents.has(contents)) return;
  privilegedContents.add(contents);
  contents.on('will-navigate', (event, url) => {
    event.preventDefault();
    if (isSafeExternalUrl(url)) {
      void safeOpenExternal(url).catch(() => {});
    }
  });
}

export type WebviewPopupHandler = (guest: WebContents, url: string) => void;

/**
 * Install app-wide guards. Must be called once, before any window is created.
 * `onWebviewPopup` lets the caller open webview popups as a preview tab
 * instead of a new window.
 */
export function installGlobalWebContentsGuards(onWebviewPopup?: WebviewPopupHandler): void {
  app.on('web-contents-created', (_event, contents) => {
    const isWebview = contents.getType() === 'webview';

    contents.setWindowOpenHandler(({ url }) => {
      if (isWebview) {
        if (onWebviewPopup && /^https?:/i.test(url)) {
          try { onWebviewPopup(contents, url); } catch {}
        }
      } else if (isSafeExternalUrl(url)) {
        void safeOpenExternal(url).catch(() => {});
      }
      return { action: 'deny' };
    });

    // Lock down any <webview> this contents tries to attach, regardless of
    // the attributes set on the tag.
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      delete (webPreferences as any).preload;
      delete (webPreferences as any).preloadURL;
      webPreferences.nodeIntegration = false;
      webPreferences.nodeIntegrationInSubFrames = false;
      webPreferences.contextIsolation = true;
      webPreferences.sandbox = true;
      webPreferences.webSecurity = true;
      webPreferences.allowRunningInsecureContent = false;
      (webPreferences as any).webviewTag = false;

      const src = typeof params?.src === 'string' ? params.src : '';
      if (src) {
        let protocol = '';
        try { protocol = new URL(src).protocol; } catch { protocol = ''; }
        if (!WEBVIEW_SRC_PROTOCOLS.has(protocol)) {
          event.preventDefault();
        }
      }
    });
  });
}
