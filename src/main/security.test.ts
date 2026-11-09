import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const openExternal = vi.fn(async () => {});
const openPath = vi.fn(async () => '');
const showItemInFolder = vi.fn();
vi.mock('electron', () => ({
  app: { on: vi.fn() },
  shell: { openExternal, openPath, showItemInFolder },
}));

const { isSafeExternalUrl, safeOpenExternal, isExecutableLike, safeOpenPath } = await import('./security.js');

beforeEach(() => {
  openExternal.mockClear();
  openPath.mockClear();
  showItemInFolder.mockClear();
});

describe('isSafeExternalUrl / safeOpenExternal', () => {
  it('allows http(s) and mailto', () => {
    expect(isSafeExternalUrl('https://brilliantai.co/download')).toBe(true);
    expect(isSafeExternalUrl('http://localhost:3000')).toBe(true);
    expect(isSafeExternalUrl('mailto:security@brilliantai.co')).toBe(true);
  });
  it('rejects schemes that can launch programs', () => {
    for (const url of [
      'file:///Applications/Calculator.app',
      'file:///C:/Windows/System32/calc.exe',
      'smb://attacker/share/payload.exe',
      'ms-msdt:/id PCWDiagnostic',
      'search-ms:query=x',
      'javascript:alert(1)',
      'vscode://some.extension/run',
      'not a url',
      '',
    ]) {
      expect(isSafeExternalUrl(url)).toBe(false);
    }
  });
  it('does not call shell.openExternal for unsafe URLs', async () => {
    const res = await safeOpenExternal('file:///etc/passwd');
    expect(res.ok).toBe(false);
    expect(openExternal).not.toHaveBeenCalled();
    await safeOpenExternal('https://example.com');
    expect(openExternal).toHaveBeenCalledWith('https://example.com/');
  });
});

describe('isExecutableLike / safeOpenPath', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bc-sec-'));
  const write = (name: string, mode = 0o644) => {
    const p = path.join(dir, name);
    fs.writeFileSync(p, 'x');
    fs.chmodSync(p, mode);
    return p;
  };

  it('treats scripts, bundles and exec-bit files as executable', () => {
    expect(isExecutableLike(write('run.command'))).toBe(true);
    expect(isExecutableLike(write('setup.exe'))).toBe(true);
    expect(isExecutableLike(write('install.sh'))).toBe(true);
    expect(isExecutableLike(path.join(dir, 'Thing.app'))).toBe(true);
    if (process.platform !== 'win32') {
      expect(isExecutableLike(write('noext', 0o755))).toBe(true);
    }
  });
  it('treats documents as safe to open', () => {
    expect(isExecutableLike(write('report.pdf'))).toBe(false);
    expect(isExecutableLike(write('image.png'))).toBe(false);
  });
  it('reveals executables instead of opening them', async () => {
    const exe = write('evil.command');
    const res = await safeOpenPath(exe);
    expect(res.revealed).toBe(true);
    expect(openPath).not.toHaveBeenCalled();
    expect(showItemInFolder).toHaveBeenCalledWith(exe);
    await safeOpenPath(write('notes.png'));
    expect(openPath).toHaveBeenCalledTimes(1);
  });
});
