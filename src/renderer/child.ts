import 'xterm/css/xterm.css';
import 'monaco-editor/min/vs/editor/editor.main.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import 'monaco-editor/esm/vs/basic-languages/scss/scss.contribution';
import 'monaco-editor/esm/vs/basic-languages/less/less.contribution';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution';
import 'monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/go/go.contribution';
import 'monaco-editor/esm/vs/basic-languages/rust/rust.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution';
import 'monaco-editor/esm/vs/basic-languages/php/php.contribution';
import 'monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution';
import 'monaco-editor/esm/vs/basic-languages/swift/swift.contribution';
import 'monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution';
import 'monaco-editor/esm/vs/basic-languages/scala/scala.contribution';
import 'monaco-editor/esm/vs/basic-languages/dart/dart.contribution';
import 'monaco-editor/esm/vs/basic-languages/lua/lua.contribution';
import 'monaco-editor/esm/vs/basic-languages/r/r.contribution';
import 'monaco-editor/esm/vs/basic-languages/shell/shell.contribution';
import 'monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution';
import 'monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution';
import 'monaco-editor/esm/vs/basic-languages/ini/ini.contribution';
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';

const globalAny = globalThis as any;
globalAny.MonacoEnvironment = globalAny.MonacoEnvironment || {
  getWorker(_moduleId: string, _label: string) {
    return new EditorWorker();
  },
};

const addressBar = document.getElementById('address-bar') as HTMLElement;
const form = document.getElementById('address-form') as HTMLFormElement;
const input = document.getElementById('address-input') as HTMLInputElement;
const homeBtn = document.getElementById('home-btn') as HTMLButtonElement;
const backBtn = document.getElementById('btn-back') as HTMLButtonElement | null;
const forwardBtn = document.getElementById('btn-forward') as HTMLButtonElement | null;
const refreshBtn = document.getElementById('btn-refresh') as HTMLButtonElement | null;
const welcome = document.getElementById('welcome-view') as HTMLElement;
const browserShell = document.getElementById('browser-shell') as HTMLElement;
const previewTabbar = document.getElementById('preview-tabbar') as HTMLElement | null;
const previewTabsEl = document.getElementById('preview-tabs') as HTMLElement | null;
const previewTabAddBtn = document.getElementById('preview-tab-add') as HTMLButtonElement | null;
const webview = document.getElementById('webview') as any;
const termShell = document.getElementById('terminal-shell') as HTMLElement;
const terminalTabsEl = document.getElementById('terminal-tabs') as HTMLElement;
const terminalAddBtn = document.getElementById('terminal-add-btn') as HTMLButtonElement;
const terminalContainerEl = document.getElementById('terminal-container') as HTMLElement;
const codeShell = document.getElementById('code-shell') as HTMLElement;

if (terminalTabsEl) {
  terminalTabsEl.setAttribute('role', 'tablist');
}

const codeWorkspaceChip = document.getElementById('code-workspace') as HTMLElement | null;
const codeBreadcrumbs = document.getElementById('code-breadcrumbs') as HTMLElement | null;
const codeFileList = document.getElementById('code-file-list') as HTMLElement | null;
const codeNewTrigger = document.getElementById('code-new-trigger') as HTMLButtonElement | null;
const codeNewMenu = document.getElementById('code-new-menu') as HTMLElement | null;
const codeNewMenuFile = codeNewMenu?.querySelector('[data-kind="file"]') as HTMLButtonElement | null;
const codeNewMenuFolder = codeNewMenu?.querySelector('[data-kind="dir"]') as HTMLButtonElement | null;
const codeEditorPath = document.getElementById('code-editor-path') as HTMLElement | null;
const codeBrowser = document.getElementById('code-browser') as HTMLElement | null;
const codeEditorView = document.getElementById('code-editor-view') as HTMLElement | null;
const codeBackBtn = document.getElementById('code-back-btn') as HTMLButtonElement | null;
const codeCopyPathBtn = document.getElementById('code-copy-path-btn') as HTMLButtonElement | null;
const codeRenameBtn = document.getElementById('code-rename-btn') as HTMLButtonElement | null;
const codeEditorContainer = document.getElementById('code-editor') as HTMLElement | null;
const codeSaveBtn = document.getElementById('code-save-btn') as HTMLButtonElement | null;
const codeSaveStatus = document.getElementById('code-save-status') as HTMLElement | null;
const codeDeleteBtn = document.getElementById('code-delete-btn') as HTMLButtonElement | null;
const codeContextMenu = document.getElementById('code-context-menu') as HTMLElement | null;
const contextMenuNewFileBtn = codeContextMenu?.querySelector('[data-action="new-file"]') as HTMLButtonElement | null;
const contextMenuNewFolderBtn = codeContextMenu?.querySelector('[data-action="new-folder"]') as HTMLButtonElement | null;
const contextMenuCopyBtn = codeContextMenu?.querySelector('[data-action="copy"]') as HTMLButtonElement | null;
const contextMenuRenameBtn = codeContextMenu?.querySelector('[data-action="rename"]') as HTMLButtonElement | null;
const contextMenuDeleteBtn = codeContextMenu?.querySelector('[data-action="delete"]') as HTMLButtonElement | null;

// Diff header elements
const diffHeader = document.getElementById('diff-header') as HTMLElement | null;
const diffHeaderFilename = document.getElementById('diff-header-filename') as HTMLElement | null;
const diffHeaderAdditions = document.getElementById('diff-header-additions') as HTMLElement | null;
const diffHeaderDeletions = document.getElementById('diff-header-deletions') as HTMLElement | null;
const codeEditorToolbar = document.getElementById('code-editor-toolbar') as HTMLElement | null;

const tabPreview = document.getElementById('tab-preview') as HTMLButtonElement;
const tabTerminal = document.getElementById('tab-terminal') as HTMLButtonElement;
const tabCode = document.getElementById('tab-code') as HTMLButtonElement;


// ANSI color codes for the welcome animation: green, blue, orange, yellow
const WELCOME_COLORS = [
  '\x1b[1;32m', // bright green
  '\x1b[1;34m', // bright blue
  '\x1b[1;38;5;208m', // orange (256-color)
  '\x1b[1;33m', // bright yellow
];

function getWelcomeArt(colorIndex: number): string {
  const color = WELCOME_COLORS[colorIndex % WELCOME_COLORS.length];
  return `\n  ${color}BrilliantCode\x1b[0m \x1b[90m- Your autonomous AI engineer\x1b[0m\n`;
}

function pickWelcomeArt(_cols: number): string {
  return getWelcomeArt(0);
}

// Animation state for color cycling
let welcomeColorIndex = 0;
const welcomeAnimationIntervals = new Map<string, ReturnType<typeof setInterval>>();

function startWelcomeAnimation(terminalId: string, term: Terminal): void {
  // Clear any existing animation for this terminal
  stopWelcomeAnimation(terminalId);
  
  welcomeColorIndex = 0;
  
  const interval = setInterval(() => {
    welcomeColorIndex = (welcomeColorIndex + 1) % WELCOME_COLORS.length;
    const color = WELCOME_COLORS[welcomeColorIndex];
    // Move cursor to the position of "BrilliantCode" (line 2, column 3) and rewrite with new color
    // Save cursor, move to line 2 col 3, write colored text, restore cursor
    const updateSequence = `\x1b7\x1b[2;3H${color}BrilliantCode\x1b[0m\x1b8`;
    try { term.write(updateSequence); } catch { }
  }, 800); // Change color every 800ms
  
  welcomeAnimationIntervals.set(terminalId, interval);
}

function stopWelcomeAnimation(terminalId: string): void {
  const interval = welcomeAnimationIntervals.get(terminalId);
  if (interval) {
    clearInterval(interval);
    welcomeAnimationIntervals.delete(terminalId);
  }
}

let editorView: monaco.editor.IStandaloneCodeEditor | null = null;
let editorModel: monaco.editor.ITextModel | null = null;
let editorChangeSubscription: monaco.IDisposable | null = null;
let diffScrollSubscription: monaco.IDisposable | null = null;
let diffLineDecorations: string[] = [];
let monacoThemesDefined = false;
let diffLanguageRegistered = false;
let jsonLanguageRegistered = false;

function defineMonacoThemes(): void {
  if (monacoThemesDefined) return;
  monaco.editor.defineTheme('bc-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#040404',
      'editorGutter.background': '#040404',
    },
  });
  monaco.editor.defineTheme('bc-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editorGutter.background': '#ffffff',
    },
  });
  monacoThemesDefined = true;
}

function setMonacoTheme(isLight: boolean): void {
  defineMonacoThemes();
  monaco.editor.setTheme(isLight ? 'bc-light' : 'bc-dark');
  try { editorView?.layout(); } catch {}
}

function ensureDiffLanguageRegistered(): void {
  if (diffLanguageRegistered) return;
  diffLanguageRegistered = true;
  try {
    monaco.languages.register({
      id: 'diff',
      extensions: ['.diff', '.patch'],
      aliases: ['Diff', 'diff'],
      mimetypes: ['text/x-diff'],
    });
    monaco.languages.setMonarchTokensProvider('diff', {
      tokenizer: {
        root: [
          [/^diff --git.*/, 'keyword'],
          [/^index .*/, 'comment'],
          [/^@@.*@@.*/, 'keyword'],
          [/^---.*/, 'comment'],
          [/^\\+\\+\\+.*/, 'comment'],
          [/^\\+.*/, 'string'],
          [/^-.*/, 'type'],
        ],
      },
    } as any);
    monaco.languages.setLanguageConfiguration('diff', {
      comments: { lineComment: '#', blockComment: ['/*', '*/'] },
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    });
  } catch {}
}

function ensureJsonLanguageRegistered(): void {
  if (jsonLanguageRegistered) return;
  jsonLanguageRegistered = true;
  try {
    monaco.languages.register({
      id: 'json',
      extensions: ['.json', '.jsonc'],
      aliases: ['JSON', 'json'],
      mimetypes: ['application/json', 'application/jsonc'],
    });
    monaco.languages.setMonarchTokensProvider('json', {
      tokenizer: {
        root: [
          [/[{}\[\]]/, 'delimiter.bracket'],
          [/[,:]/, 'delimiter'],
          [/true|false|null/, 'keyword'],
          [/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, 'number'],
          [/"(?:[^"\\]|\\.)*"/, 'string'],
          [/\s+/, 'white'],
        ],
      },
    } as any);
    monaco.languages.setLanguageConfiguration('json', {
      brackets: [
        ['{', '}'],
        ['[', ']'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '"', close: '"' },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '"', close: '"' },
      ],
    });
  } catch {}
}

function isDiffLike(path: string | null): boolean {
  const lower = (path || '').toLowerCase();
  return lower.endsWith('.diff') || lower.endsWith('.patch');
}

/** Extract the original file extension from diff content (from +++ b/path/file.ext line) */
function extractOriginalExtFromDiff(content: string): string | null {
  if (!content) return null;
  // Look for +++ b/path/to/file.ext line
  const match = content.match(/^\+\+\+\s+[ab]\/(.+)$/m);
  if (match && match[1]) {
    const filePath = match[1].trim();
    const lastDot = filePath.lastIndexOf('.');
    if (lastDot > 0) {
      return filePath.slice(lastDot).toLowerCase();
    }
  }
  return null;
}

let suppressEditorChange = false;
let copyStatusTimer: number | null = null;

const CHECK_ICON = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/></svg>';
const CLOSE_ICON = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29 10.59 10.6 16.89 4.29z"/></svg>';

let newFileContainer: HTMLElement | null = null;
let newFileForm: HTMLFormElement | null = null;
let newFileInput: HTMLInputElement | null = null;
let newFileMessage: HTMLElement | null = null;
let newFileBaseDir: string | null = null;
let newFileBusy = false;
let newEntryKind: 'file' | 'dir' = 'file';

let renameContainer: HTMLElement | null = null;
let renameForm: HTMLFormElement | null = null;
let renameInput: HTMLInputElement | null = null;
let renameMessage: HTMLElement | null = null;
let renameOriginalPath: string | null = null;
let renameBusy = false;

let contextMenuPath: string | null = null;
let contextMenuType: 'file' | 'dir' | null = null;
let contextMenuBaseDir: string | null = null;
let contextMenuOpenedAt = 0;
const isContextMenuOpen = (): boolean => Boolean(codeContextMenu && !codeContextMenu.hasAttribute('hidden'));

type MonacoLanguageConfig = { languageId: string; tabSize: number; insertSpaces: boolean };

function pickLanguageConfig(path: string | null, content?: string): MonacoLanguageConfig {
  const config: MonacoLanguageConfig = { languageId: 'plaintext', tabSize: 2, insertSpaces: true };
  if (!path) return config;
  let lower = path.toLowerCase();

  const isDiff = isDiffLike(path);
  let diffHadOriginalExt = false;

  if (isDiffLike(path) && content) {
    const origExt = extractOriginalExtFromDiff(content);
    if (origExt) {
      lower = `file${origExt}`;
      diffHadOriginalExt = true;
    }
  }

  if (isDiff && !diffHadOriginalExt) {
    config.languageId = 'diff';
    config.tabSize = 2;
    return config;
  }

  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) {
    config.languageId = 'typescript';
    config.tabSize = 2;
  } else if (lower.endsWith('.js') || lower.endsWith('.jsx') || lower.endsWith('.mjs') || lower.endsWith('.cjs')) {
    config.languageId = 'javascript';
    config.tabSize = 2;
  } else if (lower.endsWith('.json') || lower.endsWith('.jsonc')) {
    config.languageId = 'json';
    config.tabSize = 2;
  } else if (lower.endsWith('.html') || lower.endsWith('.htm')) {
    config.languageId = 'html';
    config.tabSize = 2;
  } else if (lower.endsWith('.xml') || lower.endsWith('.svg')) {
    config.languageId = 'xml';
    config.tabSize = 2;
  } else if (lower.endsWith('.css')) {
    config.languageId = 'css';
    config.tabSize = 2;
  } else if (lower.endsWith('.scss')) {
    config.languageId = 'scss';
    config.tabSize = 2;
  } else if (lower.endsWith('.less')) {
    config.languageId = 'less';
    config.tabSize = 2;
  } else if (lower.endsWith('.md') || lower.endsWith('.markdown')) {
    config.languageId = 'markdown';
    config.tabSize = 2;
  } else if (lower.endsWith('.graphql') || lower.endsWith('.gql')) {
    config.languageId = 'graphql';
    config.tabSize = 2;
  } else if (lower.endsWith('.py') || lower.endsWith('.pyw') || lower.endsWith('.pyi')) {
    config.languageId = 'python';
    config.tabSize = 4;
  } else if (lower.endsWith('.go')) {
    config.languageId = 'go';
    config.tabSize = 4;
    config.insertSpaces = false;
  } else if (lower.endsWith('.rs')) {
    config.languageId = 'rust';
    config.tabSize = 4;
  } else if (lower.endsWith('.java')) {
    config.languageId = 'java';
    config.tabSize = 4;
  } else if (lower.endsWith('.kt') || lower.endsWith('.kts')) {
    config.languageId = 'kotlin';
    config.tabSize = 4;
  } else if (lower.endsWith('.cs') || lower.endsWith('.csx')) {
    config.languageId = 'csharp';
    config.tabSize = 4;
  } else if (lower.endsWith('.c') || lower.endsWith('.h') || lower.endsWith('.cpp') || lower.endsWith('.cc') || lower.endsWith('.cxx') || lower.endsWith('.hpp') || lower.endsWith('.hxx') || lower.endsWith('.hh')) {
    config.languageId = 'cpp';
    config.tabSize = 4;
  } else if (lower.endsWith('.php') || lower.endsWith('.phtml')) {
    config.languageId = 'php';
    config.tabSize = 4;
  } else if (lower.endsWith('.rb') || lower.endsWith('.erb')) {
    config.languageId = 'ruby';
    config.tabSize = 2;
  } else if (lower.endsWith('.swift')) {
    config.languageId = 'swift';
    config.tabSize = 2;
  } else if (lower.endsWith('.scala') || lower.endsWith('.sc')) {
    config.languageId = 'scala';
    config.tabSize = 2;
  } else if (lower.endsWith('.dart')) {
    config.languageId = 'dart';
    config.tabSize = 2;
  } else if (lower.endsWith('.lua')) {
    config.languageId = 'lua';
    config.tabSize = 2;
  } else if (lower.endsWith('.r')) {
    config.languageId = 'r';
    config.tabSize = 2;
  } else if (lower.endsWith('.sql')) {
    config.languageId = 'sql';
    config.tabSize = 2;
  } else if (lower.endsWith('.yml') || lower.endsWith('.yaml')) {
    config.languageId = 'yaml';
    config.tabSize = 2;
  } else if (lower.endsWith('.ini') || lower.endsWith('.cfg') || lower.endsWith('.conf') || lower.endsWith('.properties')) {
    config.languageId = 'ini';
    config.tabSize = 2;
  } else if (lower.endsWith('.toml')) {
    config.languageId = 'ini';
    config.tabSize = 2;
  } else if (lower.endsWith('.sh') || lower.endsWith('.bash') || lower.endsWith('.zsh')) {
    config.languageId = 'shell';
    config.tabSize = 2;
  } else if (lower.endsWith('.ps1') || lower.endsWith('.psm1') || lower.endsWith('.psd1')) {
    config.languageId = 'powershell';
    config.tabSize = 2;
  } else if (lower.endsWith('dockerfile') || lower.endsWith('.dockerfile')) {
    config.languageId = 'dockerfile';
    config.tabSize = 2;
  }

  if (isDiff && config.languageId === 'plaintext') {
    config.languageId = 'diff';
  }

  return config;
}

function computeDiffDecorations(content: string): monaco.editor.IModelDeltaDecoration[] {
  const model = editorModel;
  if (!model) return [];
  const lines = content.split('\n');
  const decorations: monaco.editor.IModelDeltaDecoration[] = [];
  const metaPrefixes = ['@@', 'diff ', 'index ', '---', '+++'];

  for (let i = 0; i < lines.length; i++) {
    const text = lines[i] ?? '';
    const lineNumber = i + 1;
    let cls = '';
    if (metaPrefixes.some(prefix => text.startsWith(prefix))) {
      cls = 'monaco-diff-meta';
    } else if (text.startsWith('+') && !text.startsWith('+++')) {
      cls = 'monaco-diff-add';
    } else if (text.startsWith('-') && !text.startsWith('---')) {
      cls = 'monaco-diff-del';
    }
    if (!cls) continue;
    decorations.push({
      range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      options: { isWholeLine: true, className: cls },
    });
  }
  return decorations;
}

function ensureEditor(): void {
  if (editorView || !codeEditorContainer) return;
  defineMonacoThemes();
  const isLight = document.body.classList.contains('theme-light');
  setMonacoTheme(isLight);

  const fontMono = (() => {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
      return v || undefined;
    } catch {
      return undefined;
    }
  })();

  editorModel = monaco.editor.createModel('', 'plaintext');
  editorView = monaco.editor.create(codeEditorContainer, {
    model: editorModel,
    automaticLayout: true,
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fontMono,
    padding: { top: 18, bottom: 18 },
    renderLineHighlight: 'line',
    glyphMargin: false,
    folding: true,
    smoothScrolling: true,
    mouseWheelZoom: true,
  });

  editorView.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    void saveFile();
  });

  editorChangeSubscription = editorView.onDidChangeModelContent(() => {
    if (suppressEditorChange) return;
    handleEditorDocChanged(getEditorContent());
    if (isDiffLike(codeState.file) || (codeState.readOnly && isDiffLike(codeEditorPath?.textContent ?? null))) {
      diffLineDecorations = editorView?.deltaDecorations(diffLineDecorations, computeDiffDecorations(getEditorContent())) ?? diffLineDecorations;
    }
  });
}

function getEditorContent(): string {
  return editorModel?.getValue() ?? '';
}

function setEditorContent(content: string, moveCursorToEnd = true): void {
  if (!editorView || !editorModel) return;
  suppressEditorChange = true;
  editorModel.setValue(content);
  try {
    const lineCount = editorModel.getLineCount();
    const position = moveCursorToEnd
      ? { lineNumber: lineCount, column: editorModel.getLineMaxColumn(lineCount) }
      : { lineNumber: 1, column: 1 };
    editorView.setPosition(position);
    editorView.setSelection(new monaco.Selection(position.lineNumber, position.column, position.lineNumber, position.column));
    editorView.revealPositionInCenterIfOutsideViewport(position);
  } catch {}

  if (isDiffLike(codeState.file) || (codeState.readOnly && isDiffLike(codeEditorPath?.textContent ?? null))) {
    diffLineDecorations = editorView.deltaDecorations(diffLineDecorations, computeDiffDecorations(content));
  } else if (diffLineDecorations.length) {
    diffLineDecorations = editorView.deltaDecorations(diffLineDecorations, []);
  }
  suppressEditorChange = false;
}

function applyLanguageConfig(path: string | null, content?: string): void {
  if (!editorView) return;
  if (!editorModel) return;
  const { languageId, tabSize, insertSpaces } = pickLanguageConfig(path, content);
  if (languageId === 'diff') ensureDiffLanguageRegistered();
  if (languageId === 'json') ensureJsonLanguageRegistered();
  try { monaco.editor.setModelLanguage(editorModel, languageId); } catch {}
  try { editorModel.updateOptions({ tabSize, insertSpaces }); } catch {}
  if (isDiffLike(path)) {
    diffLineDecorations = editorView.deltaDecorations(diffLineDecorations, computeDiffDecorations(content ?? editorModel.getValue()));
  } else if (diffLineDecorations.length) {
    diffLineDecorations = editorView.deltaDecorations(diffLineDecorations, []);
  }
}

function configureEditorEditability(editable: boolean): void {
  if (!editorView) return;
  editorView.updateOptions({ readOnly: !editable });
}

function createTerminalTabElement(id: string, closeable: boolean, onActivate: () => void, onClose?: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'terminal-tab';
  btn.dataset.terminalId = id;
  btn.textContent = id;
  btn.tabIndex = -1;
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-selected', 'false');
  btn.addEventListener('click', onActivate);
  if (closeable && onClose) {
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      onClose();
    });
    btn.appendChild(closeBtn);
  }
  return btn;
}

function ensureTerminalTabVisible(tab: HTMLButtonElement): void {
  if (!terminalTabsEl) return;
  const { offsetLeft, offsetWidth } = tab;
  const tabLeft = offsetLeft;
  const tabRight = tabLeft + offsetWidth;
  const viewLeft = terminalTabsEl.scrollLeft;
  const viewRight = viewLeft + terminalTabsEl.clientWidth;
  if (tabLeft < viewLeft) {
    terminalTabsEl.scrollTo({ left: tabLeft, behavior: 'smooth' });
  } else if (tabRight > viewRight) {
    terminalTabsEl.scrollTo({ left: tabRight - terminalTabsEl.clientWidth, behavior: 'smooth' });
  }
}

function activateTerminal(id: string, opts?: { focus?: boolean }): void {
  const instance = terminals.get(id);
  if (!instance) return;
  activeTerminalId = id;
  const shouldFocusTerminal = opts?.focus !== false;
  for (const [terminalId, entry] of terminals.entries()) {
    if (terminalId === id) {
      entry.tabEl.classList.add('active');
      entry.tabEl.setAttribute('aria-selected', 'true');
      entry.tabEl.tabIndex = 0;
      entry.container.classList.add('active');
      try {
        entry.fit.fit();
        window.pty?.resize?.(entry.term.cols, entry.term.rows, terminalId);
      } catch { }
      if (shouldFocusTerminal) {
        entry.term.focus();
      }
    } else {
      entry.tabEl.classList.remove('active');
      entry.tabEl.setAttribute('aria-selected', 'false');
      entry.tabEl.tabIndex = -1;
      entry.container.classList.remove('active');
    }
  }
  if (instance) {
    ensureTerminalTabVisible(instance.tabEl);
  }
}

async function loadInitialTerminalBuffer(id: string): Promise<string | null> {
  try {
    const res = await window.pty?.read?.(id, { bytes: 200000 });
    if (res?.ok && typeof res.text === 'string') return res.text;
  } catch { }
  return null;
}


function getTerminalTheme(isLight: boolean) {
  if (isLight) {
    return {
      background: '#ffffff',
      foreground: '#1a1a1a',
      cursor: '#1a1a1a',
      selectionBackground: 'rgba(59, 130, 246, 0.35)',
      black: '#000000',
      red: '#dc2626',
      green: '#166534',
      yellow: '#d97706',
      blue: '#2563eb',
      magenta: '#7c3aed',
      cyan: '#0891b2',
      white: '#e5e7eb',
      brightBlack: '#4b5563',
      brightRed: '#ef4444',
      brightGreen: '#22c55e',
      brightYellow: '#f59e0b',
      brightBlue: '#3b82f6',
      brightMagenta: '#8b5cf6',
      brightCyan: '#06b6d4',
      brightWhite: '#ffffff'
    };
  }
  return {
    background: '#000000',
    foreground: '#E8E8E8',
    cursor: '#E8E8E8',
    selectionBackground: 'rgba(255, 255, 255, 0.3)',
    black: '#000000',
    red: '#ff5f5f',
    green: '#4ade80',
    yellow: '#fbbf24',
    blue: '#60a5fa',
    magenta: '#c084fc',
    cyan: '#22d3ee',
    white: '#e5e7eb',
    brightBlack: '#4b5563',
    brightRed: '#f87171',
    brightGreen: '#86efac',
    brightYellow: '#fcd34d',
    brightBlue: '#93c5fd',
    brightMagenta: '#d8b4fe',
    brightCyan: '#67e8f9',
    brightWhite: '#ffffff'
  };
}

function registerTerminalClipboard(term: Terminal): void {
  const isMac = navigator.platform.toLowerCase().includes('mac');
  term.attachCustomKeyEventHandler((event) => {
    const key = event.key?.toLowerCase?.() ?? '';
    const isCopyShortcut =
      (isMac && event.metaKey && !event.altKey && key === 'c' && !event.ctrlKey) ||
      (!isMac && event.ctrlKey && event.shiftKey && !event.altKey && key === 'c') ||
      (!isMac && event.ctrlKey && !event.shiftKey && !event.altKey && key === 'insert');

    if (!isCopyShortcut) return true;
    if (!term.hasSelection()) return true;

    const selection = term.getSelection();
    if (selection) void writeClipboard(selection);
    event.preventDefault();
    return false;
  });
}

async function ensureTerminalInstance(id: string, opts?: { select?: boolean; initialText?: string | null }): Promise<void> {
  if (!terminalContainerEl || !terminalTabsEl) return;
  if (terminals.has(id)) {
    if (opts?.select) activateTerminal(id);
    return;
  }

  const container = document.createElement('div');
  container.className = 'terminal-view';
  container.dataset.terminalId = id;
  terminalContainerEl.appendChild(container);

  const term = new Terminal({
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 12,
    cursorBlink: true,
    convertEol: true,
    theme: getTerminalTheme(document.body.classList.contains('theme-light'))
  });
  const fit = new FitAddon();
  term.loadAddon(fit);
  term.open(container);
  fit.fit();
  registerTerminalClipboard(term);

  const disposeData = window.pty?.onData ? (window.pty.onData(id, (data) => {
    stopWelcomeAnimation(id); // Stop color animation when shell outputs
    try { term.write(data); } catch { }
  }) || (() => { })) : () => { };

  term.onData((chunk) => {
    stopWelcomeAnimation(id); // Stop color animation when user types
    try { window.pty?.write?.(chunk, id); } catch { }
  });

  const initialText = typeof opts?.initialText === 'string' ? opts.initialText : null;
  if (initialText && initialText.trim() !== '') {
    try { term.write(initialText); } catch { }
  } else {
    try { 
      term.write(pickWelcomeArt(term.cols)); 
      startWelcomeAnimation(id, term);
    } catch { }
  }

  const resizeObserver = new ResizeObserver(() => {
    try {
      fit.fit();
      window.pty?.resize?.(term.cols, term.rows, id);
    } catch { }
  });
  resizeObserver.observe(container);

  const closeable = id !== 'default';
  const tabEl = createTerminalTabElement(id, closeable, () => activateTerminal(id), closeable ? () => handleRequestCloseTerminal(id) : undefined);
  terminals.set(id, {
    id,
    term,
    fit,
    container,
    disposeData,
    resizeObserver,
    tabEl,
    closeBtn: closeable ? (tabEl.querySelector('.close') as HTMLButtonElement | undefined) : undefined,
  });

  terminalTabsEl.appendChild(tabEl);

  if (opts?.select !== false) {
    activateTerminal(id);
  }
}

function disposeTerminalInstance(id: string): void {
  stopWelcomeAnimation(id);
  const instance = terminals.get(id);
  if (!instance) return;
  terminals.delete(id);
  try { instance.disposeData(); } catch { }
  try { instance.resizeObserver.disconnect(); } catch { }
  try { instance.term.dispose(); } catch { }
  instance.container.remove();
  instance.tabEl.remove();
}

async function ensureTerminalInitialized(id: string, select = false): Promise<void> {
  const initial = await loadInitialTerminalBuffer(id);
  await ensureTerminalInstance(id, { select, initialText: initial });
}

async function handleRequestCloseTerminal(id: string): Promise<void> {
  if (id === 'default') return;
  try {
    await window.pty?.dispose?.(id);
  } catch (error) {
    console.error('Failed to dispose terminal', error);
  }
}

function handleTerminalClosed(id: string): void {
  const existed = terminals.has(id);
  disposeTerminalInstance(id);
  if (terminals.size === 0) {
    activeTerminalId = 'default';
    return;
  }
  if (id === activeTerminalId || !terminals.has(activeTerminalId)) {
    const fallback = terminals.get('default') ?? terminals.values().next().value;
    if (fallback) activateTerminal(fallback.id);
  }
  if (existed) {
    console.log(`Terminal ${id} closed`);
  }
}

let terminalsInitialized = false;
let terminalUnsubs: Array<() => void> = [];
let terminalListenersRegistered = false;
let pendingTerminalCreations: Array<{ terminalId: string; cwd?: string }> = [];

// Register terminal event listeners immediately at module load
// This ensures we don't miss any terminal:created events from main process
function registerTerminalListeners(): void {
  if (terminalListenersRegistered) return;
  terminalListenersRegistered = true;

  const unsubCreated = window.pty?.onCreated?.((payload) => {
    const id = payload?.terminalId;
    if (typeof id !== 'string' || !id) return;
    
    // If terminals aren't initialized yet, queue this for later
    if (!terminalsInitialized) {
      if (!pendingTerminalCreations.some(p => p.terminalId === id)) {
        pendingTerminalCreations.push({ terminalId: id, cwd: payload?.cwd });
      }
      return;
    }
    
    if (terminals.has(id)) return;
    void ensureTerminalInitialized(id, false);
  });
  if (typeof unsubCreated === 'function') terminalUnsubs.push(unsubCreated);

  const unsubClosed = window.pty?.onClosed?.((payload) => {
    const id = payload?.terminalId;
    if (typeof id !== 'string' || !id) return;
    // Remove from pending if it was queued
    pendingTerminalCreations = pendingTerminalCreations.filter(p => p.terminalId !== id);
    handleTerminalClosed(id);
  });
  if (typeof unsubClosed === 'function') terminalUnsubs.push(unsubClosed);
}

// Register listeners immediately when module loads
registerTerminalListeners();

// Pre-fetch terminal list data early (non-blocking)
// This warms up the data so initializeTerminals is faster when tab is activated
let prefetchedTerminalList: { id: string; cwd: string; cols: number; rows: number }[] | null = null;
(async () => {
  try {
    const res = await window.pty?.list?.();
    if (res?.ok && Array.isArray(res.terminals)) {
      prefetchedTerminalList = res.terminals;
    }
  } catch { }
})();

async function initializeTerminals(select = true): Promise<void> {
  // Ensure listeners are registered (defensive)
  registerTerminalListeners();
  
  if (terminalsInitialized) {
    if (!terminals.size) {
      terminalsInitialized = false;
    } else {
      if (select && terminals.has(activeTerminalId)) {
        activateTerminal(activeTerminalId);
      } else if (select) {
        // activeTerminalId not found, try to activate default or first available
        await activateTerminalWithRetry('default', { maxRetries: 3, delayMs: 100 });
      }
      return;
    }
  }
  terminalsInitialized = true;

  let terminalList: { id: string; cwd: string; cols: number; rows: number }[] = [];
  
  // Use prefetched data if available, otherwise fetch with retry
  if (prefetchedTerminalList && prefetchedTerminalList.length > 0) {
    terminalList = prefetchedTerminalList;
    prefetchedTerminalList = null; // Clear after use
  } else {
    // Retry fetching terminal list a few times in case main process isn't ready
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await window.pty?.list?.();
        if (res?.ok && Array.isArray(res.terminals)) {
          terminalList = res.terminals;
          break;
        }
      } catch { }
      // Wait a bit before retrying
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  // Process any pending terminal creations that arrived before we were ready
  for (const pending of pendingTerminalCreations) {
    if (!terminalList.some(t => t.id === pending.terminalId)) {
      terminalList.push({ id: pending.terminalId, cwd: pending.cwd || '', cols: 80, rows: 24 });
    }
  }
  pendingTerminalCreations = [];

  // Ensure default terminal is in the list
  if (!terminalList.some(item => item.id === 'default')) {
    terminalList.unshift({ id: 'default', cwd: '', cols: 80, rows: 24 });
  }

  // Initialize all terminals
  for (const entry of terminalList) {
    await ensureTerminalInitialized(entry.id, false);
  }

  // Activate with retry to handle any race conditions
  if (select) {
    await activateTerminalWithRetry('default', { maxRetries: 5, delayMs: 50 });
  }
}

// Retry activating a terminal with exponential backoff
async function activateTerminalWithRetry(
  id: string, 
  opts: { maxRetries?: number; delayMs?: number; focus?: boolean } = {}
): Promise<boolean> {
  const { maxRetries = 3, delayMs = 100, focus = true } = opts;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (terminals.has(id)) {
      activateTerminal(id, { focus });
      return true;
    }
    
    if (attempt < maxRetries) {
      // Wait before retrying, with slight exponential backoff
      await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  
  // Fallback: try to activate any available terminal
  const firstTerminal = terminals.values().next().value;
  if (firstTerminal) {
    activateTerminal(firstTerminal.id, { focus });
    return true;
  }
  
  return false;
}

async function handleAddTerminal(): Promise<void> {
  try {
    const res = await window.pty?.create?.();
    if (res?.ok && res.terminalId) {
      await ensureTerminalInitialized(res.terminalId, true);
    } else if (res?.error) {
      console.error('Failed to create terminal:', res.error);
    }
  } catch (error) {
    console.error('Failed to create terminal', error);
  }
}

function handleEditorDocChanged(content: string): void {
  if (codeState.readOnly) {
    updateDirtyState(false);
    return;
  }
  const changed = content !== codeState.fileContent;
  updateDirtyState(changed);
}

function updateDirtyState(isDirty: boolean): void {
  codeState.dirty = isDirty;
  if (codeSaveBtn) codeSaveBtn.disabled = codeState.readOnly || !isDirty;
  if (codeSaveStatus) {
    if (isDirty) {
      codeSaveStatus.textContent = 'Unsaved changes';
      codeSaveStatus.classList.remove('error');
    } else if (!codeSaveStatus.classList.contains('error')) {
      codeSaveStatus.textContent = '';
    }
  }
}

const qs = new URLSearchParams(window.location.search);
let CWD = qs.get('cwd') || '';
window.workspace?.onChanged((cwd) => { CWD = cwd; onWorkspaceChanged(cwd); });

// Listen for theme changes from main renderer
(window as any).layout?.onTheme?.((theme: 'dark' | 'light') => {
  const isLight = theme === 'light';
  if (isLight) {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
  setMonacoTheme(isLight);
  applyTerminalTheme(isLight);
});

// Apply initial theme from localStorage (shared with main renderer)
try {
  const saved = localStorage.getItem('bc.ui');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed?.theme === 'light') {
      document.body.classList.add('theme-light');
    }
  }
} catch { }

function looksLikeDomain(s: string): boolean { return /\./.test(s) && !/[\s\/]/.test(s); }
function toFileURL(absPath: string | null): string | null {
  if (!absPath) return null;
  const norm = absPath.replace(/\\/g, '/');
  if (norm.startsWith('file://')) return norm;
  if (/^[a-zA-Z]:\//.test(norm)) return 'file:///' + norm;
  return 'file://' + norm;
}
function normalizeAddress(inputRaw: string | null): string | null {
  let v = (inputRaw || '').trim();
  if (!v) return null;
  if (/^about:blank$/i.test(v)) return 'about:blank';
  v = v.replace(/^(localhost|127\.0\.0\.1)\s+(\d{2,5})$/i, '$1:$2');
  if (/^([a-z][a-z0-9+.-]*):\/\//i.test(v)) return v;
  if (v.startsWith('/')) return toFileURL(v);
  if (/^[a-zA-Z]:\\/.test(v)) return toFileURL(v);
  if (/\.(html?|md|txt|pdf|png|jpe?g|gif|svg|webp)$/i.test(v)) {
    return CWD ? toFileURL(CWD.replace(/\\/g, '/') + '/' + v.replace(/^\.\//, '')) : v;
  }
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d{2,5})$/i.test(v)) return 'http://' + v;
  if (looksLikeDomain(v)) return 'https://' + v;
  return 'https://' + v;
}

function showWelcome(): void {
  browserVisible = false;
  if (browserShell) {
    browserShell.hidden = true;
    browserShell.style.display = 'none';
  }
  if (welcome) {
    welcome.hidden = false;
    welcome.style.display = '';
  }
  updatePreviewNavButtons();
}
let browserVisible = false;

type PreviewTab = {
  id: string;
  title: string;
  history: string[];
  index: number;
};

type PreviewTabSnapshot = { id: string; title: string; url: string };

const getTabCurrentUrl = (tab: PreviewTab): string => tab.history[tab.index] ?? 'about:blank';

const snapshotTab = (tab: PreviewTab): PreviewTabSnapshot => ({
  id: tab.id,
  title: tab.title || computePreviewTabTitle(getTabCurrentUrl(tab)),
  url: getTabCurrentUrl(tab),
});

const getActivePreviewTab = (): PreviewTab | null => {
  if (activePreviewTabId && previewTabs.has(activePreviewTabId)) {
    return previewTabs.get(activePreviewTabId)!;
  }
  const first = previewTabs.values().next();
  return first.done ? null : first.value;
};

const previewTabs = new Map<string, PreviewTab>();
let activePreviewTabId: string | null = null;
let suppressHistoryPush = false;

function setActivePreviewTab(tab: PreviewTab): void {
  activePreviewTabId = tab.id;
  input.value = getTabCurrentUrl(tab);
}

function showBrowser(url: string): void {
  if (!url) return;
  browserVisible = true;
  if (welcome) {
    welcome.hidden = true;
    welcome.style.display = 'none';
  }
  const previewActive = tabPreview?.classList.contains('active') ?? false;
  if (browserShell) {
    browserShell.hidden = !previewActive;
    browserShell.style.display = previewActive ? '' : 'none';
  }
  try { webview.src = url; } catch { }
}

function computePreviewTabTitle(url: string): string {
  if (!url || url === 'about:blank') return 'New Tab';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'file:') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      return decodeURIComponent(parts[parts.length - 1] || 'File');
    }
    return parsed.hostname || url;
  } catch {
    const trimmed = url.replace(/^https?:\/\//i, '');
    const host = trimmed.split(/[/?#]/)[0];
    return host || url;
  }
}

function ensurePreviewTabExists(): PreviewTab {
  const current = getActivePreviewTab();
  if (current) return current;
  return createPreviewTab('about:blank', { activate: true });
}

function renderPreviewTabs(): void {
  if (!previewTabsEl) return;
  previewTabsEl.innerHTML = '';
  const tabs = Array.from(previewTabs.values());
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    const btn = document.createElement('div');
    btn.className = `preview-tab${tab.id === activePreviewTabId ? ' active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', tab.id === activePreviewTabId ? 'true' : 'false');
    btn.tabIndex = tab.id === activePreviewTabId ? 0 : -1;
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = tab.title || computePreviewTabTitle(tab.history[tab.index] ?? '');
    btn.appendChild(label);
    const activate = () => activatePreviewTab(tab.id);
    btn.addEventListener('click', activate);
    btn.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
    if (previewTabs.size > 1) {
      const close = document.createElement('span');
      close.className = 'close';
      close.setAttribute('role', 'button');
      close.setAttribute('tabindex', '0');
      close.setAttribute('aria-label', 'Close tab');
      close.textContent = '×';
      const closeHandler = (event: Event) => {
        event.stopPropagation();
        closePreviewTab(tab.id);
      };
      close.addEventListener('click', closeHandler);
      close.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          closeHandler(event);
        }
      });
      btn.appendChild(close);
    }
    previewTabsEl?.appendChild(btn);
  });
}

function updatePreviewNavButtons(): void {
  const tab = getActivePreviewTab();
  const canGoBack = !!tab && tab.index > 0;
  const canGoForward = !!tab && tab.index < tab.history.length - 1;
  if (backBtn) backBtn.disabled = !canGoBack;
  if (forwardBtn) forwardBtn.disabled = !canGoForward;
}

function loadTabUrl(tab: PreviewTab, urlOverride?: string): void {
  const url = urlOverride ?? getTabCurrentUrl(tab);
  suppressHistoryPush = true;
  showBrowser(url);
  input.value = url;
  tab.title = computePreviewTabTitle(url);
  renderPreviewTabs();
  updatePreviewNavButtons();
}

function activatePreviewTab(id: string, opts?: { load?: boolean }): PreviewTab | null {
  const tab = previewTabs.get(id);
  if (!tab) return null;
  setActivePreviewTab(tab);
  if (opts?.load !== false) {
    loadTabUrl(tab);
  }
  return tab;
}

function createPreviewTab(initialUrl?: string, opts?: { activate?: boolean }): PreviewTab {
  const id = `preview-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const normalized = initialUrl === 'about:blank'
    ? 'about:blank'
    : (normalizeAddress(initialUrl ?? 'about:blank') ?? 'about:blank');
  const tab: PreviewTab = {
    id,
    title: computePreviewTabTitle(normalized),
    history: [normalized],
    index: 0,
  };
  previewTabs.set(id, tab);
  if (opts?.activate !== false) {
    setActivePreviewTab(tab);
    renderPreviewTabs();
    updatePreviewNavButtons();
  } else {
    renderPreviewTabs();
    updatePreviewNavButtons();
  }
  return tab;
}

function closePreviewTab(id: string): PreviewTab | null {
  if (!previewTabs.has(id)) {
    return getActivePreviewTab();
  }
  const order = Array.from(previewTabs.keys());
  const closingIndex = order.indexOf(id);
  previewTabs.delete(id);
  if (!previewTabs.size) {
    const newTab = createPreviewTab('about:blank');
    loadTabUrl(newTab);
    return newTab;
  }
  if (activePreviewTabId === id) {
    const ids = Array.from(previewTabs.keys());
    const nextIndex = Math.min(closingIndex, ids.length - 1);
    const next = activatePreviewTab(ids[nextIndex]);
    return next ?? getActivePreviewTab();
  }
  renderPreviewTabs();
  updatePreviewNavButtons();
  return getActivePreviewTab();
}

function navigateTo(url: string, push = true): void {
  const tab = ensurePreviewTabExists();
  navigateTab(tab, url, { push, focus: true });
}

function navigateTab(tab: PreviewTab, url: string, opts?: { push?: boolean; focus?: boolean }): PreviewTabSnapshot {
  const normalized = url && url !== '' ? (url === 'about:blank' ? 'about:blank' : (normalizeAddress(url) ?? url)) : 'about:blank';
  const push = opts?.push !== false;
  if (push) {
    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push(normalized);
    tab.index = tab.history.length - 1;
  } else {
    tab.history[tab.index] = normalized;
  }
  tab.title = computePreviewTabTitle(normalized);
  setActivePreviewTab(tab);
  loadTabUrl(tab, normalized);
  if (opts?.focus !== false) {
    setActive('preview');
  }
  return snapshotTab(tab);
}

function handleWebviewNavigation(url: string | null | undefined): void {
  if (!url) return;
  const tab = getActivePreviewTab();
  if (!tab) return;
  if (suppressHistoryPush) {
    suppressHistoryPush = false;
    tab.history[tab.index] = url;
  } else {
    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push(url);
    tab.index = tab.history.length - 1;
  }
  tab.title = computePreviewTabTitle(url);
  setActivePreviewTab(tab);
  renderPreviewTabs();
  updatePreviewNavButtons();
}

function triggerNavigate(): void {
  const url = normalizeAddress(input.value);
  if (url) navigateTo(url, true);
}

form?.addEventListener('submit', (e) => { e.preventDefault(); triggerNavigate(); });
document.getElementById('go-btn')?.addEventListener('click', () => triggerNavigate());
homeBtn?.addEventListener('click', () => showWelcome());

webview?.addEventListener?.('load-commit', (e: any) => { try { if (e.isMainFrame && e.url) input.value = e.url; } catch { } });
webview?.addEventListener?.('did-navigate', (e: any) => {
  try { handleWebviewNavigation(e.url); } catch { }
});
webview?.addEventListener?.('did-navigate-in-page', (e: any) => {
  try { handleWebviewNavigation(e.url); } catch { }
});
webview?.addEventListener?.('new-window', (e: any) => {
  e.preventDefault?.();
  if (e.url) navigateTo(e.url, true);
});
webview?.addEventListener?.('page-title-updated', (e: any) => {
  try {
    const tab = getActivePreviewTab();
    if (!tab) return;
    const title = typeof e?.title === 'string' ? e.title.trim() : '';
    if (title) {
      tab.title = title;
      renderPreviewTabs();
    }
  } catch { }
});
webview?.addEventListener?.('did-fail-load', (e: any) => {
  const isMainFrame = !!e?.isMainFrame;
  if (!isMainFrame) return;

  const errorCode = typeof e?.errorCode === 'number' ? e.errorCode : 0;
  const ignoredErrorCodes = new Set([-3, -6, -7, -10, -21, -27, -100, -102, -105]);
  if (ignoredErrorCodes.has(errorCode)) return;

  const failingUrl = typeof e?.validatedURL === 'string' ? e.validatedURL : '';
  if (!failingUrl || failingUrl === 'about:blank') return;

  const descriptionRaw = typeof e?.errorDescription === 'string' && e.errorDescription.trim()
    ? e.errorDescription.trim()
    : 'Check the address and try again.';

  const err = `<!doctype html><meta charset="utf-8"><title>Load failed</title>` +
    `<style>html,body{height:100%;margin:0;background:#111;color:#eee;display:grid;place-items:center;font:13px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}` +
    `.card{max-width:560px;padding:24px;border:1px solid #2a2a2a;background:#181818;border-radius:10px}` +
    `.card h1{font-size:18px;margin:0 0 8px}</style>` +
    `<div class="card"><h1>Could not load page</h1><p>${escapeHtml(descriptionRaw)}</p><p><code>${escapeHtml(failingUrl)}</code></p></div>`;
  try { webview.loadURL('data:text/html;base64,' + btoa(err)); } catch { }
});

backBtn?.addEventListener('click', () => {
  const tab = getActivePreviewTab();
  if (tab && tab.index > 0) {
    tab.index -= 1;
    loadTabUrl(tab);
  }
});

forwardBtn?.addEventListener('click', () => {
  const tab = getActivePreviewTab();
  if (tab && tab.index < tab.history.length - 1) {
    tab.index += 1;
    loadTabUrl(tab);
  }
});

type TerminalInstance = {
  id: string;
  term: Terminal;
  fit: FitAddon;
  container: HTMLElement;
  disposeData: () => void;
  resizeObserver: ResizeObserver;
  tabEl: HTMLButtonElement;
  closeBtn?: HTMLButtonElement;
};

const terminals = new Map<string, TerminalInstance>();
let activeTerminalId = 'default';

function applyTerminalTheme(isLight: boolean) {
  const theme = getTerminalTheme(isLight);
  for (const instance of terminals.values()) {
    instance.term.options.theme = theme;
  }
}

type CodeEntry = { name: string; type: 'dir' | 'file' };

const codeState = {
  root: '',
  dir: '.',
  entries: [] as CodeEntry[],
  file: null as string | null,
  fileContent: '',
  dirty: false,
  initialized: false,
  readOnly: true,
  autoRefreshInterval: null as number | null,
};

const directoryCache = new Map<string, CodeEntry[]>();
const expandedDirs = new Set<string>();
const loadingDirs = new Set<string>();

const normalizeRel = (pathValue: string): string => {
  if (!pathValue || pathValue === '.') return '.';
  return pathValue.replace(/\\/g, '/');
};
const relJoin = (base: string, child: string): string => {
  const b = normalizeRel(base);
  if (!b || b === '.') return child;
  return `${b}/${child}`.replace(/\\/g, '/');
};
const parentDir = (dir: string): string => {
  const normalized = normalizeRel(dir);
  if (!normalized || normalized === '.') return '.';
  const parts = normalized.split('/').filter(Boolean);
  parts.pop();
  return parts.length ? parts.join('/') : '.';
};

const normalizeAbs = (input: string | null | undefined): string => (input || '').replace(/\\/g, '/');

const cssEscape = (value: string): string => {
  if (typeof window !== 'undefined' && window.CSS?.escape) {
    return window.CSS.escape(value);
  }
  return value.replace(/[^\w-]/g, (char) => `\\${char}`);
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
}

const buildAbsolutePath = (rel: string | null): string | null => {
  const normalizedRel = normalizeRel(rel || '.');
  const root = normalizeAbs(codeState.root);
  if (!root) return normalizedRel === '.' ? '.' : normalizedRel;
  if (!normalizedRel || normalizedRel === '.') return root;
  const separator = root.endsWith('/') ? '' : '/';
  return `${root}${separator}${normalizedRel}`;
};

async function writeClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch { }
  return false;
}

function showCopyFeedback(type: 'file' | 'dir'): void {
  if (!codeSaveStatus) return;
  if (codeSaveStatus.classList.contains('error')) return;
  if (codeState.dirty) return;
  const label = type === 'file' ? 'Copied file path' : 'Copied folder path';
  codeSaveStatus.textContent = label;
  if (copyStatusTimer) window.clearTimeout(copyStatusTimer);
  copyStatusTimer = window.setTimeout(() => {
    if (!codeState.dirty && codeSaveStatus.textContent === label) {
      codeSaveStatus.textContent = '';
    }
  }, 1200);
}

function updateBackButtonState(): void {
  if (!codeBackBtn) return;
  const hasFile = Boolean(codeState.file);
  const dir = normalizeRel(codeState.dir);
  const canGoUp = dir !== '.';
  const viewingExternal = !codeState.file && Boolean(codeBrowser?.hidden);
  const enabled = hasFile || canGoUp || viewingExternal;
  codeBackBtn.disabled = !enabled;
  if (hasFile) {
    codeBackBtn.title = 'Back to folder';
    codeBackBtn.setAttribute('aria-label', 'Back to folder');
  } else if (canGoUp) {
    codeBackBtn.title = 'Up to parent folder';
    codeBackBtn.setAttribute('aria-label', 'Up to parent folder');
  } else if (viewingExternal) {
    codeBackBtn.title = 'Back to workspace';
    codeBackBtn.setAttribute('aria-label', 'Back to workspace');
  } else {
    codeBackBtn.title = 'Back';
    codeBackBtn.setAttribute('aria-label', 'Back');
  }
}

type CopyTarget = { text: string; type: 'file' | 'dir' } | null;

function getCopyTarget(): CopyTarget {
  if (codeState.file) {
    const rel = normalizeRel(codeState.file);
    const abs = buildAbsolutePath(rel);
    const text = abs ?? rel;
    if (text) return { text, type: 'file' };
  }
  if (!codeState.file && !codeBrowser?.hidden) {
    const relDir = normalizeRel(codeState.dir);
    const abs = buildAbsolutePath(relDir);
    const text = abs ?? (relDir || '.');
    if (text) return { text, type: 'dir' };
  }
  const pathLabel = codeEditorPath?.textContent?.trim();
  if (pathLabel) {
    return { text: pathLabel, type: 'file' };
  }
  const root = normalizeAbs(codeState.root);
  if (root) return { text: root, type: 'dir' };
  return null;
}

function updateCopyButtonState(): void {
  if (!codeCopyPathBtn) return;
  const target = getCopyTarget();
  codeCopyPathBtn.disabled = !target;
  const label = target?.type === 'dir' ? 'Copy folder path' : 'Copy file path';
  codeCopyPathBtn.title = label || 'Copy path';
  codeCopyPathBtn.setAttribute('aria-label', label || 'Copy path');
}

function updateDeleteButtonState(): void {
  if (!codeDeleteBtn) return;
  const canDelete = Boolean(codeState.file) && !codeState.readOnly;
  const label = canDelete ? 'Delete file' : 'Delete file (open a workspace file)';
  codeDeleteBtn.disabled = !canDelete;
  codeDeleteBtn.title = label;
  codeDeleteBtn.setAttribute('aria-label', label);
}

function updateRenameButtonState(): void {
  if (!codeRenameBtn) return;
  const canRename = Boolean(codeState.file) && !codeState.readOnly;
  const label = canRename ? 'Rename file' : 'Rename file (open a workspace file)';
  codeRenameBtn.disabled = !canRename;
  codeRenameBtn.title = label;
  codeRenameBtn.setAttribute('aria-label', label);
}

function hideContextMenu(): void {
  if (!codeContextMenu) return;
  if (!codeContextMenu.hasAttribute('hidden')) {
    codeContextMenu.setAttribute('hidden', '');
    codeContextMenu.style.visibility = '';
    codeContextMenu.style.pointerEvents = '';
    codeContextMenu.style.left = '';
    codeContextMenu.style.top = '';
  }
  contextMenuPath = null;
  contextMenuType = null;
  contextMenuBaseDir = null;
}

function hideNewMenu(): void {
  if (!codeNewMenu) return;
  if (!codeNewMenu.hasAttribute('hidden')) {
    codeNewMenu.setAttribute('hidden', '');
  }
}

function toggleNewMenu(): void {
  if (!codeNewMenu) return;
  if (codeNewMenu.hasAttribute('hidden')) {
    hideContextMenu();
    codeNewMenu.removeAttribute('hidden');
  } else {
    codeNewMenu.setAttribute('hidden', '');
  }
}

function showContextMenu(relPath: string, type: 'file' | 'dir', clientX: number, clientY: number): void {
  if (!codeContextMenu) return;
  hideContextMenu();
  hideNewMenu();
  contextMenuOpenedAt = Date.now();
  contextMenuPath = normalizeRel(relPath);
  contextMenuType = type;
  contextMenuBaseDir = type === 'dir' ? contextMenuPath : normalizeRel(parentDir(relPath));

  const canRename = type === 'file';
  const canDelete = type === 'file' || type === 'dir';
  const canCreateInside = type === 'dir';
  if (contextMenuRenameBtn) contextMenuRenameBtn.hidden = !canRename;
  if (contextMenuDeleteBtn) contextMenuDeleteBtn.hidden = !canDelete;
  if (contextMenuNewFileBtn) contextMenuNewFileBtn.hidden = !canCreateInside;
  if (contextMenuNewFolderBtn) contextMenuNewFolderBtn.hidden = !canCreateInside;

  codeContextMenu.removeAttribute('hidden');
  codeContextMenu.style.visibility = 'hidden';
  codeContextMenu.style.pointerEvents = 'none';
  codeContextMenu.style.left = '0px';
  codeContextMenu.style.top = '0px';

  const menuRect = codeContextMenu.getBoundingClientRect();
  const padding = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  let left = clientX + scrollX;
  let top = clientY + scrollY;

  if (left + menuRect.width + padding > viewportWidth + scrollX) {
    left = Math.max(padding + scrollX, viewportWidth + scrollX - menuRect.width - padding);
  }
  if (top + menuRect.height + padding > viewportHeight + scrollY) {
    top = Math.max(padding + scrollY, viewportHeight + scrollY - menuRect.height - padding);
  }

  codeContextMenu.style.left = `${left}px`;
  codeContextMenu.style.top = `${top}px`;
  codeContextMenu.style.visibility = 'visible';
  codeContextMenu.style.pointerEvents = '';
}

function removeCreateFileForm(): void {
  newFileBusy = false;
  newFileBaseDir = null;
  if (newFileContainer?.isConnected) {
    newFileContainer.remove();
  }
  newFileContainer = null;
  newFileForm = null;
  newFileInput = null;
  newFileMessage = null;
  newEntryKind = 'file';
}

function setCreateFileBusy(busy: boolean): void {
  newFileBusy = busy;
  if (!newFileForm) return;
  const submitBtn = newFileForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const cancelBtn = newFileForm.querySelector('button[data-action="cancel"]') as HTMLButtonElement | null;
  if (submitBtn) submitBtn.disabled = busy;
  if (cancelBtn) cancelBtn.disabled = busy;
  if (newFileInput) {
    newFileInput.disabled = busy;
    if (!busy) newFileInput.focus();
  }
}

function setCreateFileError(message: string | null): void {
  if (!newFileMessage) return;
  newFileMessage.textContent = message || '';
  newFileMessage.hidden = !message;
}

function focusCreateFileInput(select = false): void {
  if (!newFileInput || newFileBusy) return;
  newFileInput.focus();
  if (select) newFileInput.select();
}

function showCreateEntryForm(baseDir: string, kind: 'file' | 'dir'): void {
  if (!codeFileList) return;
  const normalizedBase = normalizeRel(baseDir);
  const host = findChildrenContainer(normalizedBase) ?? codeFileList;
  const depth = normalizedBase === '.' ? 0 : normalizedBase.split('/').filter(Boolean).length;
  if (newFileContainer && newFileBaseDir === normalizedBase) {
    setCreateFileError(null);
    setCreateFileBusy(false);
    newFileContainer.style.setProperty('--depth', String(depth));
    host.prepend(newFileContainer);
    focusCreateFileInput(true);
    return;
  }
  removeCreateFileForm();
  newFileBaseDir = normalizedBase;
  newEntryKind = kind;
  const container = document.createElement('div');
  container.className = 'code-item creating';
  container.style.setProperty('--depth', String(depth));
  const row = document.createElement('div');
  row.className = 'code-new-file-row';
  const spacer = document.createElement('span');
  spacer.className = 'code-node-toggle spacer';
  spacer.setAttribute('aria-hidden', 'true');
  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.innerHTML = kind === 'file'
    ? '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 4h7v5h5v11H6V4z"/></svg>'
    : '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-6l-2-2z"/></svg>';
  const form = document.createElement('form');
  form.className = 'code-new-file-form';
  form.autocomplete = 'off';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'code-new-file-input';
  const hint = normalizedBase === '.' ? 'workspace root' : normalizedBase;
  if (kind === 'file') {
    input.placeholder = `new-file (in ${hint})`;
    input.setAttribute('aria-label', `New file name in ${hint}`);
  } else {
    input.placeholder = `new-folder (in ${hint})`;
    input.setAttribute('aria-label', `New folder name in ${hint}`);
  }
  const actions = document.createElement('div');
  actions.className = 'code-new-file-actions';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'code-new-file-submit';
  submitBtn.innerHTML = CHECK_ICON;
  if (kind === 'file') {
    submitBtn.title = 'Create file';
    submitBtn.setAttribute('aria-label', 'Create file');
  } else {
    submitBtn.title = 'Create folder';
    submitBtn.setAttribute('aria-label', 'Create folder');
  }
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.dataset.action = 'cancel';
  cancelBtn.className = 'code-new-file-cancel';
  cancelBtn.innerHTML = CLOSE_ICON;
  cancelBtn.title = 'Cancel';
  cancelBtn.setAttribute('aria-label', 'Cancel new item');
  actions.append(submitBtn, cancelBtn);
  form.append(input, actions);
  const message = document.createElement('div');
  message.className = 'code-new-file-error';
  message.hidden = true;
  row.append(spacer, icon, form);
  container.append(row, message);
  host.prepend(container);
  newFileContainer = container;
  newFileForm = form;
  newFileInput = input;
  newFileMessage = message;
  newFileBusy = false;
  setCreateFileError(null);
  cancelBtn.addEventListener('click', () => removeCreateFileForm());
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      removeCreateFileForm();
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (newFileBusy) return;
    void submitCreateEntry();
  });
  focusCreateFileInput(true);
}
async function copyEntryPath(relPath: string, type: 'file' | 'dir'): Promise<boolean> {
  const normalized = normalizeRel(relPath);
  const abs = buildAbsolutePath(normalized);
  const text = abs ?? normalized;
  if (!text) return false;
  const success = await writeClipboard(text);
  if (success) showCopyFeedback(type);
  return success;
}

async function submitCreateEntry(): Promise<void> {
  const inputValue = newFileInput?.value ?? '';
  const trimmed = inputValue.trim();
  const baseDir = normalizeRel(newFileBaseDir ?? (codeState.file ? parentDir(codeState.file) : codeState.dir));
  if (!trimmed) {
    setCreateFileError(newEntryKind === 'file' ? 'Enter a file name' : 'Enter a folder name');
    focusCreateFileInput(true);
    return;
  }
  if (/^[\\/]/.test(trimmed)) {
    setCreateFileError('Use a relative name inside the workspace');
    focusCreateFileInput(true);
    return;
  }
  if (trimmed.split('/').some(part => part === '..')) {
    setCreateFileError('Name cannot include .. segments');
    focusCreateFileInput(true);
    return;
  }
  if (newEntryKind === 'dir' && trimmed.includes('/')) {
    setCreateFileError('Create nested folders one level at a time');
    focusCreateFileInput(true);
    return;
  }
  const relPath = normalizeRel(relJoin(baseDir, trimmed));
  if (!relPath || relPath === '.') {
    setCreateFileError(newEntryKind === 'file' ? 'File name is required' : 'Folder name is required');
    focusCreateFileInput(true);
    return;
  }
  setCreateFileError(null);
  setCreateFileBusy(true);
  try {
    if (newEntryKind === 'file') {
      const res = await window.files?.create?.({ path: relPath, content: '' });
      if (!res?.ok) throw new Error(res?.error || 'Failed to create file');
      removeCreateFileForm();
      await loadDir(baseDir);
      await openFile(relPath);
      if (codeSaveStatus) {
        codeSaveStatus.textContent = 'Created file';
        codeSaveStatus.classList.remove('error');
        window.setTimeout(() => {
          if (!codeState.dirty && codeSaveStatus.textContent === 'Created file') {
            codeSaveStatus.textContent = '';
          }
        }, 1200);
      }
    } else {
      const res = await window.files?.createDir?.({ path: relPath });
      if (!res?.ok) throw new Error(res?.error || 'Failed to create folder');
      removeCreateFileForm();
      await loadDir(baseDir);
      if (codeSaveStatus) {
        codeSaveStatus.textContent = 'Created folder';
        codeSaveStatus.classList.remove('error');
        window.setTimeout(() => {
          if (!codeState.dirty && codeSaveStatus.textContent === 'Created folder') {
            codeSaveStatus.textContent = '';
          }
        }, 1200);
      }
    }
  } catch (error) {
    console.error('Failed to create entry', error);
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'File already exists') {
      setCreateFileError('File already exists');
    } else if (message === 'Directory already exists') {
      setCreateFileError('Folder already exists');
    } else {
      setCreateFileError(message);
    }
    setCreateFileBusy(false);
  }
}

function removeRenameForm(restoreLayout = true): void {
  renameBusy = false;
  renameOriginalPath = null;
  if (renameContainer?.isConnected) {
    renameContainer.remove();
  }
  renameContainer = null;
  renameForm = null;
  renameInput = null;
  renameMessage = null;
  if (restoreLayout && codeState.file && !codeState.readOnly) {
    if (codeBrowser) codeBrowser.hidden = true;
    codeEditorView?.parentElement?.classList.add('editor-active');
  }
}

function setRenameBusy(busy: boolean): void {
  renameBusy = busy;
  if (!renameForm) return;
  const submitBtn = renameForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const cancelBtn = renameForm.querySelector('button[data-action="cancel"]') as HTMLButtonElement | null;
  if (submitBtn) submitBtn.disabled = busy;
  if (cancelBtn) cancelBtn.disabled = busy;
  if (renameInput) {
    renameInput.disabled = busy;
    if (!busy) renameInput.focus();
  }
}

function setRenameError(message: string | null): void {
  if (!renameMessage) return;
  renameMessage.textContent = message || '';
  renameMessage.hidden = !message;
}

function focusRenameInput(select = false): void {
  if (!renameInput || renameBusy) return;
  renameInput.focus();
  if (select) renameInput.select();
}

function findFileItem(relPath: string): HTMLElement | null {
  if (!codeFileList) return null;
  const escaped = cssEscape(relPath);
  return codeFileList.querySelector(`.code-item[data-rel-path="${escaped}"]`);
}

function flashItemCopied(relPath: string): void {
  const item = findFileItem(relPath);
  if (!item) return;
  item.classList.add('copied');
  window.setTimeout(() => item.classList.remove('copied'), 700);
}

function showRenameForm(relPath: string): void {
  if (!codeFileList) return;
  hideContextMenu();
  const normalized = normalizeRel(relPath);
  const item = findFileItem(normalized);
  if (!item) return;
  removeCreateFileForm();
  if (renameOriginalPath === normalized && renameContainer) {
    item.insertAdjacentElement('afterend', renameContainer);
    setRenameError(null);
    setRenameBusy(false);
    focusRenameInput(true);
    return;
  }
  removeRenameForm(false);
  renameOriginalPath = normalized;
  const baseDir = parentDir(normalized);
  const segment = normalized.split('/').filter(Boolean).slice(-1)[0] || normalized;
  const container = document.createElement('div');
  container.className = 'code-rename-row';
  const depth = Math.max(0, normalized.split('/').filter(Boolean).length - 1);
  container.style.setProperty('--depth', String(depth));
  const form = document.createElement('form');
  form.className = 'code-rename-form';
  form.autocomplete = 'off';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'code-rename-input';
  input.value = segment;
  input.setAttribute('aria-label', 'New file name');
  const actions = document.createElement('div');
  actions.className = 'code-rename-actions';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'code-rename-submit';
  submitBtn.innerHTML = CHECK_ICON;
  submitBtn.title = 'Apply rename';
  submitBtn.setAttribute('aria-label', 'Apply rename');
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.dataset.action = 'cancel';
  cancelBtn.className = 'code-rename-cancel';
  cancelBtn.innerHTML = CLOSE_ICON;
  cancelBtn.title = 'Cancel';
  cancelBtn.setAttribute('aria-label', 'Cancel rename');
  actions.append(submitBtn, cancelBtn);
  form.append(input, actions);
  const message = document.createElement('div');
  message.className = 'code-rename-error';
  message.hidden = true;
  container.append(form, message);
  item.insertAdjacentElement('afterend', container);
  renameContainer = container;
  renameForm = form;
  renameInput = input;
  renameMessage = message;
  renameBusy = false;
  setRenameError(null);
  cancelBtn.addEventListener('click', () => removeRenameForm());
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      removeRenameForm();
    }
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (renameBusy) return;
    void submitRename();
  });
  focusRenameInput(true);
}

async function submitRename(): Promise<void> {
  const original = renameOriginalPath;
  if (!renameInput || !original) return;
  const inputValue = renameInput.value ?? '';
  const trimmed = inputValue.trim();
  if (!trimmed) {
    setRenameError('Enter a file name');
    focusRenameInput(true);
    return;
  }
  if (/[\\/]/.test(trimmed)) {
    setRenameError('Name cannot include path separators');
    focusRenameInput(true);
    return;
  }
  if (trimmed.split('/').some(part => part === '..')) {
    setRenameError('Name cannot include .. segments');
    focusRenameInput(true);
    return;
  }
  const baseDir = parentDir(original);
  const newRel = normalizeRel(relJoin(baseDir, trimmed));
  if (!newRel || newRel === '.') {
    setRenameError('Invalid file name');
    focusRenameInput(true);
    return;
  }
  if (newRel === normalizeRel(original)) {
    removeRenameForm();
    return;
  }
  setRenameError(null);
  setRenameBusy(true);
  try {
    const res = await window.files?.rename?.({ from: original, to: newRel });
    if (!res?.ok) throw new Error(res?.error || 'Failed to rename file');
    const wasOpen = codeState.file === normalizeRel(original);
    if (wasOpen) {
      codeState.file = normalizeRel(newRel);
      if (codeEditorPath) codeEditorPath.textContent = codeState.file;
    }
    removeRenameForm();
    await loadDir(codeState.dir);
    if (wasOpen) {
      updateEditorState();
      updateCopyButtonState();
    }
    if (codeSaveStatus) {
      codeSaveStatus.textContent = 'Renamed file';
      codeSaveStatus.classList.remove('error');
      window.setTimeout(() => {
        if (!codeState.dirty && codeSaveStatus.textContent === 'Renamed file') {
          codeSaveStatus.textContent = '';
        }
      }, 1200);
    }
  } catch (error) {
    console.error('Failed to rename file', error);
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'Destination already exists') {
      setRenameError('A file with that name already exists');
    } else if (message === 'Renaming directories is not supported yet') {
      setRenameError('Renaming directories is not supported yet');
    } else {
      setRenameError(message);
    }
    setRenameBusy(false);
  }
}

function updateWorkspaceChip(cwd: string | null | undefined): void {
  if (!codeWorkspaceChip) return;
  const normalized = normalizeRel(cwd || '');
  const parts = normalized.split('/').filter(Boolean);
  const label = parts.slice(-1)[0] || normalized || 'Workspace';
  codeWorkspaceChip.textContent = label || 'Workspace';
  codeWorkspaceChip.title = cwd || '';
  updateCopyButtonState();
}

function startAutoRefresh(): void {
  // Clear any existing interval
  stopAutoRefresh();
  // Auto-refresh every 2 seconds if no file is open and code tab is active
  codeState.autoRefreshInterval = window.setInterval(() => {
    const isCodeTabActive = tabCode.classList.contains('active');
    const noFileOpen = !codeState.file;
    const creating = Boolean(newFileContainer);
    const renaming = Boolean(renameContainer);
    if (isCodeTabActive && noFileOpen && codeState.initialized && !creating && !renaming && !isContextMenuOpen()) {
      // Use silent mode to avoid flicker if nothing changed
      loadDir(codeState.dir, true);
    }
  }, 2000);
}

function stopAutoRefresh(): void {
  if (codeState.autoRefreshInterval !== null) {
    window.clearInterval(codeState.autoRefreshInterval);
    codeState.autoRefreshInterval = null;
  }
}

async function startCreateEntry(baseDir: string, kind: 'file' | 'dir'): Promise<void> {
  removeRenameForm();
  hideContextMenu();
  hideNewMenu();
  const normalizedBase = normalizeRel(baseDir);
  expandedDirs.add(normalizedBase);
  if (!directoryCache.has(normalizedBase)) {
    await loadDir(normalizedBase, true, { setActiveDir: false });
  } else {
    renderFileTree();
  }
  codeState.dir = normalizedBase;
  updateBreadcrumbs();
  showCreateEntryForm(normalizedBase, kind);
  renderFileTree();
}

function handleCreateFile(): void {
  const baseDir = normalizeRel(codeState.file ? parentDir(codeState.file) : codeState.dir);
  void startCreateEntry(baseDir, 'file');
}

function handleCreateFolder(baseDir?: string | null): void {
  const resolvedBase = normalizeRel(baseDir ?? (codeState.file ? parentDir(codeState.file) : codeState.dir));
  void startCreateEntry(resolvedBase, 'dir');
}

async function handleDeleteEntryTarget(relPath?: string | null, entryType: 'file' | 'dir' = 'file'): Promise<void> {
  const fallback = entryType === 'dir' ? null : (codeState.file ?? '');
  const target = normalizeRel(relPath ?? fallback ?? '');
  if (!target || target === '.') return;
  hideContextMenu();
  const isDir = entryType === 'dir';
  const confirmed = window.confirm(isDir
    ? `Delete folder ${target}? This will remove all contents.`
    : `Delete ${target}? This action cannot be undone.`);
  if (!confirmed) return;
  try {
    const res = await window.files?.delete?.({ path: target });
    if (!res?.ok) throw new Error(res?.error || 'Failed to delete file');
    if (entryType === 'dir') {
      const dirKey = normalizeRel(codeState.dir);
      const prefix = `${target}/`;
      if (dirKey === target || dirKey.startsWith(prefix)) {
        codeState.dir = normalizeRel(parentDir(target) || '.');
      }
      for (const key of Array.from(directoryCache.keys())) {
        if (key === target || key.startsWith(prefix)) directoryCache.delete(key);
      }
      for (const key of Array.from(expandedDirs.values())) {
        if (key === target || key.startsWith(prefix)) expandedDirs.delete(key);
      }
    }
    const wasOpen = codeState.file === target;
    if (renameOriginalPath === target) {
      removeRenameForm();
    }
    if (wasOpen) {
      codeState.file = null;
      codeState.fileContent = '';
      codeState.dirty = false;
      updateEditorState();
    }
    await loadDir(normalizeRel(codeState.dir));
    if (codeSaveStatus && wasOpen) {
      codeSaveStatus.textContent = '';
      codeSaveStatus.classList.remove('error');
    }
  } catch (error) {
    console.error('Failed to delete entry', error);
    if (codeSaveStatus) {
      codeSaveStatus.textContent = error instanceof Error ? error.message : String(error);
      codeSaveStatus.classList.add('error');
    }
  }
}

async function handleDeleteActiveFile(): Promise<void> {
  await handleDeleteEntryTarget(codeState.file, 'file');
}

function handleRenameFileTarget(relPath?: string | null): void {
  const target = normalizeRel(relPath ?? '');
  if (!target || target === '.') return;
  hideContextMenu();
  showRenameForm(target);
}

function handleRenameActiveFile(): void {
  if (!codeState.file || codeState.readOnly) return;
  if (codeBrowser) codeBrowser.hidden = false;
  codeEditorView?.parentElement?.classList.remove('editor-active');
  handleRenameFileTarget(codeState.file);
}

function findChildrenContainer(dir: string): HTMLElement | null {
  if (!codeFileList) return null;
  const normalized = normalizeRel(dir);
  if (normalized === '.') {
    return codeFileList.querySelector('[data-root-children="true"]') as HTMLElement | null;
  }
  const escaped = cssEscape(normalized);
  return codeFileList.querySelector(`.code-children[data-parent-path="${escaped}"]`) as HTMLElement | null;
}

function renderDirectoryRows(baseDir: string, entries: CodeEntry[], depth: number, parentEl: HTMLElement): void {
  entries.forEach((entry) => {
    const relPath = normalizeRel(relJoin(baseDir, entry.name));
    const item = document.createElement('div');
    item.className = 'code-item';
    item.dataset.relPath = relPath;
    item.dataset.type = entry.type;
    item.style.setProperty('--depth', String(depth));
    const isActiveFile = codeState.file === relPath;
    const isActiveDir = !codeState.file && codeState.dir === relPath && entry.type === 'dir';
    if (isActiveFile) item.classList.add('active');
    if (isActiveDir) item.classList.add('dir-active');

    if (entry.type === 'dir') {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'code-node-toggle';
      const expanded = expandedDirs.has(relPath);
      toggle.innerHTML = expanded ? '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M6 9l6 6 6-6z"/></svg>' : '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M9 6l6 6-6 6z"/></svg>';
      toggle.setAttribute('aria-label', expanded ? 'Collapse folder' : 'Expand folder');
      if (loadingDirs.has(relPath)) toggle.classList.add('loading');
      toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        void toggleDirectory(relPath);
      });
      item.appendChild(toggle);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'code-node-toggle spacer';
      spacer.setAttribute('aria-hidden', 'true');
      item.appendChild(spacer);
    }

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.innerHTML = entry.type === 'dir'
      ? '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>'
      : '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 4h7v5h5v11H6V4z"/></svg>';
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = entry.name;
    item.append(icon, label);
    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      showContextMenu(relPath, entry.type, event.clientX, event.clientY);
    });
    if (entry.type === 'dir') {
      item.addEventListener('click', (event) => {
        const now = Date.now();
        if ((event as MouseEvent).ctrlKey || now - contextMenuOpenedAt < 250) return;
        void navigateToDirectory(relPath);
      });
    } else {
      item.addEventListener('click', (event) => {
        const now = Date.now();
        if ((event as MouseEvent).ctrlKey || now - contextMenuOpenedAt < 250) return;
        removeRenameForm(false);
        removeCreateFileForm();
        hideContextMenu();
        void openFile(relPath);
      });
    }
    parentEl.appendChild(item);

    if (entry.type === 'dir') {
      const children = document.createElement('div');
      children.className = 'code-children';
      children.dataset.parentPath = relPath;
      if (expandedDirs.has(relPath)) {
        const cached = directoryCache.get(relPath) || [];
        if (loadingDirs.has(relPath) && !cached.length) {
          const loadingItem = document.createElement('div');
          loadingItem.className = 'code-item code-loading';
          loadingItem.style.setProperty('--depth', String(depth + 1));
          loadingItem.textContent = 'Loading…';
          children.appendChild(loadingItem);
        } else if (cached.length) {
          renderDirectoryRows(relPath, cached, depth + 1, children);
        } else {
          const empty = document.createElement('div');
          empty.className = 'code-item code-empty';
          empty.style.setProperty('--depth', String(depth + 1));
          empty.textContent = 'Empty folder';
          children.appendChild(empty);
        }
      } else {
        children.hidden = true;
      }
      parentEl.appendChild(children);
    }
  });
}

function renderFileTree(): void {
  if (!codeFileList) return;
  hideContextMenu();
  updateBreadcrumbs();
  codeFileList.innerHTML = '';

  const rootKey = normalizeRel('.');
  const rootEntries = directoryCache.get(rootKey) ?? codeState.entries ?? [];
  const rootContainer = document.createElement('div');
  rootContainer.className = 'code-tree-root';
  rootContainer.dataset.rootChildren = 'true';

  if (loadingDirs.has(rootKey) && !rootEntries.length) {
    const loading = document.createElement('div');
    loading.className = 'code-item code-loading';
    loading.textContent = 'Loading…';
    rootContainer.appendChild(loading);
  } else if (rootEntries.length) {
    renderDirectoryRows(rootKey, rootEntries, 0, rootContainer);
  } else {
    const empty = document.createElement('div');
    empty.className = 'code-item code-empty';
    empty.textContent = 'Workspace is empty';
    rootContainer.appendChild(empty);
  }

  codeFileList.appendChild(rootContainer);

  if (newFileContainer && newFileBaseDir) {
    const host = findChildrenContainer(newFileBaseDir) ?? rootContainer;
    host.prepend(newFileContainer);
    focusCreateFileInput();
  }

  if (renameContainer && renameOriginalPath && !renameContainer.isConnected) {
    const anchor = findFileItem(renameOriginalPath);
    if (anchor) {
      anchor.insertAdjacentElement('afterend', renameContainer);
      focusRenameInput();
    }
  }

  updateBackButtonState();
  updateCopyButtonState();
}

async function toggleDirectory(relPath: string): Promise<void> {
  const target = normalizeRel(relPath);
  if (expandedDirs.has(target)) {
    expandedDirs.delete(target);
    renderFileTree();
    return;
  }
  expandedDirs.add(target);
  await loadDir(target, true, { setActiveDir: false });
  renderFileTree();
}

async function ensurePathVisible(dir: string): Promise<void> {
  const normalized = normalizeRel(dir);
  if (!normalized) return;
  if (!directoryCache.has('.')) {
    await loadDir('.', true, { setActiveDir: false });
  }
  if (normalized === '.') return;
  const parts = normalized.split('/').filter(Boolean);
  let current = '.';
  for (const part of parts) {
    current = current === '.' ? part : `${current}/${part}`;
    if (!expandedDirs.has(current)) expandedDirs.add(current);
    if (!directoryCache.has(current)) {
      await loadDir(current, true, { setActiveDir: false });
    }
  }
}

async function loadDir(dir: string, silent = false, opts: { setActiveDir?: boolean } = {}): Promise<void> {
  const target = normalizeRel(dir);
  const updateActiveDir = opts.setActiveDir !== false;
  let resolved = target;
  let hadError = false;
  let shouldRender = true;
  if (!silent || !directoryCache.has(target)) {
    loadingDirs.add(target);
    if (!silent) {
      renderFileTree();
    }
  }

  try {
    const res = await window.files?.list?.({ dir: target });
    if (!res?.ok) throw new Error(res?.error || 'Failed to list files');

    resolved = normalizeRel(res.path || target);
    const newEntries = (res.entries || []) as CodeEntry[];
    const previousEntries = directoryCache.get(resolved) || [];
    const hasChanged = !arraysEqual(previousEntries, newEntries);

    loadingDirs.delete(resolved);
    directoryCache.set(resolved, newEntries);

    if (updateActiveDir) {
      codeState.dir = resolved;
      codeState.entries = newEntries;
    } else if (codeState.dir === resolved) {
      codeState.entries = newEntries;
    }

    if (!codeState.root && res.root) {
      codeState.root = res.root;
      updateWorkspaceChip(res.root);
    }

    if (updateActiveDir) {
      expandedDirs.add(resolved);
    }

    if (!hasChanged && silent) {
      shouldRender = false;
      return;
    }
  } catch (error) {
    hadError = true;
    loadingDirs.delete(resolved);
    loadingDirs.delete(target);
    if (updateActiveDir && codeFileList) {
      const message = error instanceof Error ? error.message : String(error);
      // Error text can include file paths from the workspace; never parse it as HTML.
      const errorEl = document.createElement('div');
      errorEl.className = 'code-item code-error';
      errorEl.textContent = message || 'File browser unavailable';
      codeFileList.replaceChildren(errorEl);
    }
  } finally {
    if (shouldRender && (!hadError || !updateActiveDir)) {
      renderFileTree();
    }
    if (updateActiveDir) {
      updateBackButtonState();
      updateCopyButtonState();
    }
  }
}

function arraysEqual(a: CodeEntry[], b: CodeEntry[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].name !== b[i].name || a[i].type !== b[i].type) return false;
  }
  return true;
}

function getWorkspaceDisplayName(): string {
  const chipLabel = codeWorkspaceChip?.textContent?.trim();
  if (chipLabel) return chipLabel;
  const root = normalizeAbs(codeState.root);
  if (root) {
    const parts = root.split('/').filter(Boolean);
    return parts[parts.length - 1] || root;
  }
  return 'Workspace';
}

function updateBreadcrumbs(): void {
  if (!codeBreadcrumbs) return;
  const dir = normalizeRel(codeState.dir);
  const parts = dir === '.' ? [] : dir.split('/').filter(Boolean);
  const crumbs = [{ label: getWorkspaceDisplayName(), path: '.' }, ...parts.map((segment, index) => ({
    label: segment,
    path: parts.slice(0, index + 1).join('/')
  }))];

  codeBreadcrumbs.innerHTML = '';
  crumbs.forEach((crumb, index) => {
    if (index > 0) {
      const sep = document.createElement('span');
      sep.className = 'breadcrumb-sep';
      sep.textContent = '/';
      codeBreadcrumbs.appendChild(sep);
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = crumb.label || '.';
    const crumbPath = normalizeRel(crumb.path || '.');
    button.dataset.path = crumbPath;
    if (crumbPath === dir) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.addEventListener('click', () => {
        void navigateToDirectory(crumbPath);
      });
    }
    codeBreadcrumbs.appendChild(button);
  });

  const rootAbs = normalizeAbs(codeState.root);
  const absolutePath = rootAbs
    ? `${rootAbs}${parts.length ? `/${parts.join('/')}` : ''}`
    : parts.length ? parts.join('/') : getWorkspaceDisplayName();
  if (absolutePath) {
    codeBreadcrumbs.setAttribute('title', absolutePath);
  } else {
    codeBreadcrumbs.removeAttribute('title');
  }
}

async function navigateToDirectory(relPath: string): Promise<void> {
  const target = normalizeRel(relPath);
  if (codeState.dir === target) {
    updateBreadcrumbs();
    expandedDirs.add(target);
    await loadDir(target, true);
    return;
  }
  removeRenameForm(false);
  removeCreateFileForm();
  hideContextMenu();
  codeState.dir = target;
  codeState.file = null;
  codeState.fileContent = '';
  codeState.dirty = false;
  updateEditorState();
  expandedDirs.add(target);
  await ensurePathVisible(target);
  updateBreadcrumbs();
  await loadDir(target);
}

async function openFile(relPath: string): Promise<void> {
  try {
    const normalizedPath = normalizeRel(relPath);
    const res = await window.files?.read?.({ path: normalizedPath });
    if (!res?.ok) throw new Error(res?.error || 'Failed to read file');

    if (res.isBinary) {
      const openExternal = window.files?.openExternal;
      if (!openExternal) {
        throw new Error('External opener unavailable');
      }
      const external = await openExternal({ path: normalizedPath });
      if (!external?.ok) {
        throw new Error(external?.error || 'Unable to open file externally');
      }
      if (codeSaveStatus) {
        codeSaveStatus.textContent = 'Opened in default application';
        codeSaveStatus.classList.remove('error');
        setTimeout(() => {
          if (!codeState.dirty && codeSaveStatus.textContent === 'Opened in default application') {
            codeSaveStatus.textContent = '';
          }
        }, 1800);
      }
      renderFileTree();
      updateBackButtonState();
      updateCopyButtonState();
      return;
    }

    codeState.dir = parentDir(normalizedPath);
    await ensurePathVisible(codeState.dir);
    expandedDirs.add(codeState.dir);
    codeState.file = normalizedPath;
    // When opening a file normally, ensure toolbar is visible and diff header is hidden
    if (diffHeader) diffHeader.classList.remove('visible');
    if (codeEditorToolbar) codeEditorToolbar.style.display = '';
    codeState.fileContent = res.content || '';
    codeState.dirty = false;
    updateEditorState();
    renderFileTree();
    updateBackButtonState();
    updateCopyButtonState();
  } catch (error) {
    if (codeSaveStatus) {
      codeSaveStatus.textContent = error instanceof Error ? error.message : String(error);
      codeSaveStatus.classList.add('error');
    }
  }
}

async function saveFile(): Promise<void> {
  if (!codeState.file || codeState.readOnly) return;
  try {
    const content = getEditorContent();
    const res = await window.files?.write?.({ path: codeState.file, content });
    if (!res?.ok) throw new Error(res?.error || 'Failed to save file');
    codeState.fileContent = content;
    updateDirtyState(false);
    if (codeSaveStatus) {
      codeSaveStatus.textContent = 'Saved';
      codeSaveStatus.classList.remove('error');
      setTimeout(() => {
        if (!codeState.dirty) codeSaveStatus.textContent = '';
      }, 1200);
    }
  } catch (error) {
    if (codeSaveStatus) {
      codeSaveStatus.textContent = error instanceof Error ? error.message : String(error);
      codeSaveStatus.classList.add('error');
    }
  }
}

// Type for a single diff section (one file in a multi-file diff)
type DiffSection = {
  filename: string;
  fullPath: string;
  startLine: number;
  endLine: number;
  additions: number;
  deletions: number;
};

// Store current diff sections for scroll-based header updates
let currentDiffSections: DiffSection[] = [];

// Parse all file sections in a diff content with their line positions
function parseAllDiffSections(content: string): DiffSection[] {
  if (!content) return [];
  
  const lines = content.split('\n');
  const sections: DiffSection[] = [];
  let currentSection: Partial<DiffSection> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for diff --git header (start of a new file section)
    const diffGitMatch = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (diffGitMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.filename) {
        currentSection.endLine = i - 1;
        sections.push(currentSection as DiffSection);
      }
      
      // Start new section
      const fullPath = diffGitMatch[2];
      const parts = fullPath.split('/');
      currentSection = {
        filename: parts[parts.length - 1] || fullPath,
        fullPath: fullPath,
        startLine: i,
        endLine: lines.length - 1,
        additions: 0,
        deletions: 0,
      };
      continue;
    }
    
    // Alternative: check for --- and +++ headers if no "diff --git" found
    if (!currentSection) {
      const minusMatch = line.match(/^--- (?:a\/)?(.+)$/);
      if (minusMatch && minusMatch[1] !== '/dev/null') {
        const fullPath = minusMatch[1];
        const parts = fullPath.split('/');
        currentSection = {
          filename: parts[parts.length - 1] || fullPath,
          fullPath: fullPath,
          startLine: i,
          endLine: lines.length - 1,
          additions: 0,
          deletions: 0,
        };
        continue;
      }
      
      const plusMatch = line.match(/^\+\+\+ (?:b\/)?(.+)$/);
      if (plusMatch && plusMatch[1] !== '/dev/null' && !currentSection) {
        const fullPath = plusMatch[1];
        const parts = fullPath.split('/');
        currentSection = {
          filename: parts[parts.length - 1] || fullPath,
          fullPath: fullPath,
          startLine: i,
          endLine: lines.length - 1,
          additions: 0,
          deletions: 0,
        };
        continue;
      }
    }
    
    // Count additions and deletions for current section
    if (currentSection) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        currentSection.additions = (currentSection.additions || 0) + 1;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        currentSection.deletions = (currentSection.deletions || 0) + 1;
      }
    }
  }
  
  // Don't forget to add the last section
  if (currentSection && currentSection.filename) {
    currentSection.endLine = lines.length - 1;
    sections.push(currentSection as DiffSection);
  }
  
  return sections;
}

// Parse diff content and extract filename and stats (legacy function for single file diffs)
function parseDiffContent(content: string): { filename: string; additions: number; deletions: number } | null {
  const sections = parseAllDiffSections(content);
  if (sections.length === 0) return null;
  
  // Return first section info for backward compatibility
  const first = sections[0];
  return {
    filename: first.filename,
    additions: first.additions,
    deletions: first.deletions,
  };
}

// Track the current visible section to avoid unnecessary updates
let currentVisibleSectionIndex = -1;

function showDiffHeader(filename: string, additions: number, deletions: number): void {
  if (!diffHeader) return;
  
  if (diffHeaderFilename) {
    diffHeaderFilename.textContent = filename;
  }
  if (diffHeaderAdditions) {
    diffHeaderAdditions.textContent = additions > 0 ? `+${additions}` : '';
  }
  if (diffHeaderDeletions) {
    diffHeaderDeletions.textContent = deletions > 0 ? `-${deletions}` : '';
  }
  
  diffHeader.classList.add('visible');
  // Hide the editor toolbar when showing diff (read-only view)
  if (codeEditorToolbar) codeEditorToolbar.style.display = 'none';
}

function hideDiffHeader(): void {
  if (diffHeader) {
    diffHeader.classList.remove('visible');
    // Restore the editor toolbar when hiding diff
    if (codeEditorToolbar) codeEditorToolbar.style.display = '';
  }
  // Teardown scroll listener and clear diff sections
  teardownDiffScrollListener();
  currentDiffSections = [];
  currentVisibleSectionIndex = -1;
}

// Find which diff section is currently visible at the top of the editor viewport
function findVisibleDiffSection(): DiffSection | null {
  if (!editorView || currentDiffSections.length === 0) return null;

  // Get the line number at the top of the visible viewport
  const ranges = editorView.getVisibleRanges();
  const topLine = (ranges[0]?.startLineNumber ?? 1) - 1; // 0-indexed
  
  // Find the section that contains this line
  for (let i = currentDiffSections.length - 1; i >= 0; i--) {
    const section = currentDiffSections[i];
    if (topLine >= section.startLine) {
      return section;
    }
  }
  
  // Default to first section if we're above all sections
  return currentDiffSections[0] || null;
}

// Update the diff header based on current scroll position
function updateDiffHeaderOnScroll(): void {
  const section = findVisibleDiffSection();
  if (!section) return;
  
  // Find the index of this section
  const sectionIndex = currentDiffSections.indexOf(section);
  
  // Only update if section changed
  if (sectionIndex !== currentVisibleSectionIndex) {
    currentVisibleSectionIndex = sectionIndex;
    showDiffHeader(section.filename, section.additions, section.deletions);
  }
}

// Set up scroll listener for the diff header
function setupDiffScrollListener(): void {
  if (!editorView) return;

  teardownDiffScrollListener();
  diffScrollSubscription = editorView.onDidScrollChange(() => {
    updateDiffHeaderOnScroll();
  });
}

// Remove scroll listener
function teardownDiffScrollListener(): void {
  if (diffScrollSubscription) {
    try { diffScrollSubscription.dispose(); } catch {}
    diffScrollSubscription = null;
  }
}

// Initialize diff sections and scroll listener for a diff file
function initDiffSections(content: string): void {
  // Parse all sections
  currentDiffSections = parseAllDiffSections(content);
  currentVisibleSectionIndex = -1;
  
  if (currentDiffSections.length > 0) {
    // Show the first section initially
    const first = currentDiffSections[0];
    showDiffHeader(first.filename, first.additions, first.deletions);
    currentVisibleSectionIndex = 0;
    
    // Set up scroll listener
    setupDiffScrollListener();
  } else {
    hideDiffHeader();
  }
}

function updateEditorState(): void {
  if (!codeEditorPath || !codeSaveBtn) return;
  if (codeState.file) {
    removeCreateFileForm();
    ensureEditor();
    if (codeBrowser) codeBrowser.hidden = true;
    if (codeEditorView) {
      codeEditorView.hidden = false;
      codeEditorView.parentElement?.classList.add('editor-active');
    }
    codeState.readOnly = false;
    configureEditorEditability(true);
    applyLanguageConfig(codeState.file, codeState.fileContent);
    const current = getEditorContent();
    if (current !== codeState.fileContent) {
      setEditorContent(codeState.fileContent, false);
    }
    editorView?.focus();
    codeEditorPath.textContent = codeState.file;
    // Hide diff header for regular files
    hideDiffHeader();
    // Stop auto-refresh when viewing a file
    stopAutoRefresh();
  } else {
    if (codeBrowser) codeBrowser.hidden = false;
    if (codeEditorView) {
      codeEditorView.hidden = true;
      codeEditorView.parentElement?.classList.remove('editor-active');
    }
    if (editorView) {
      configureEditorEditability(false);
      applyLanguageConfig(null);
      setEditorContent('', false);
    }
    codeState.readOnly = true;
    codeEditorPath.textContent = 'Select a file to edit';
    // Hide diff header when showing directory
    hideDiffHeader();
    // Restart auto-refresh when returning to directory view (only if code tab is active)
    if (tabCode.classList.contains('active')) {
      startAutoRefresh();
    }
  }
  updateDirtyState(codeState.dirty);
  if (codeSaveStatus && !codeState.dirty) {
    codeSaveStatus.textContent = '';
    codeSaveStatus.classList.remove('error');
  }
  updateBackButtonState();
  updateCopyButtonState();
  updateRenameButtonState();
  updateDeleteButtonState();
}

codeSaveBtn?.addEventListener('click', () => saveFile());
codeNewTrigger?.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleNewMenu();
});
codeNewMenuFile?.addEventListener('click', () => {
  hideNewMenu();
  handleCreateFile();
});
codeNewMenuFolder?.addEventListener('click', () => {
  const base = normalizeRel(codeState.file ? parentDir(codeState.file) : codeState.dir);
  hideNewMenu();
  handleCreateFolder(base);
});
codeRenameBtn?.addEventListener('click', () => handleRenameActiveFile());
codeDeleteBtn?.addEventListener('click', () => { void handleDeleteActiveFile(); });
codeBackBtn?.addEventListener('click', () => {
  if (codeState.file) {
    codeState.file = null;
    codeState.fileContent = '';
    codeState.dirty = false;
    updateEditorState();
    expandedDirs.add(codeState.dir);
    renderFileTree();
    return;
  }
  if (codeBrowser?.hidden) {
    codeState.fileContent = '';
    codeState.dirty = false;
    updateEditorState();
    void loadDir(codeState.dir);
    return;
  }
  const dir = normalizeRel(codeState.dir);
  if (dir !== '.') {
    codeState.dir = parentDir(dir);
    codeState.file = null;
    codeState.fileContent = '';
    codeState.dirty = false;
    updateEditorState();
    expandedDirs.add(codeState.dir);
    void loadDir(codeState.dir);
  }
});
codeCopyPathBtn?.addEventListener('click', async () => {
  const target = getCopyTarget();
  if (!target) return;
  const success = await writeClipboard(target.text);
  if (success) showCopyFeedback(target.type);
});

contextMenuCopyBtn?.addEventListener('click', async () => {
  const path = contextMenuPath;
  const type = contextMenuType;
  hideContextMenu();
  if (!path || !type) return;
  const success = await copyEntryPath(path, type);
  if (success) flashItemCopied(path);
});

contextMenuNewFileBtn?.addEventListener('click', () => {
  const base = contextMenuType === 'dir' && contextMenuPath ? contextMenuPath : contextMenuBaseDir ?? codeState.dir;
  hideContextMenu();
  void startCreateEntry(base, 'file');
});

contextMenuNewFolderBtn?.addEventListener('click', () => {
  const base = contextMenuType === 'dir' && contextMenuPath ? contextMenuPath : contextMenuBaseDir ?? codeState.dir;
  hideContextMenu();
  void startCreateEntry(base, 'dir');
});

contextMenuRenameBtn?.addEventListener('click', () => {
  const path = contextMenuPath;
  const type = contextMenuType;
  hideContextMenu();
  if (!path || type !== 'file') return;
  handleRenameFileTarget(path);
});

contextMenuDeleteBtn?.addEventListener('click', () => {
  const path = contextMenuPath;
  const type = contextMenuType ?? 'file';
  hideContextMenu();
  if (!path) return;
  void handleDeleteEntryTarget(path, type);
});

document.addEventListener('pointerdown', (event) => {
  const target = event.target as Node;
  if (codeContextMenu && !codeContextMenu.hasAttribute('hidden')) {
    if (!codeContextMenu.contains(target)) hideContextMenu();
  }
  if (codeNewMenu && !codeNewMenu.hasAttribute('hidden')) {
    if (target !== codeNewTrigger && !codeNewMenu.contains(target)) hideNewMenu();
  }
});

window.addEventListener('blur', () => { hideContextMenu(); hideNewMenu(); });
window.addEventListener('resize', () => { hideContextMenu(); hideNewMenu(); });
document.addEventListener('scroll', () => { hideContextMenu(); hideNewMenu(); }, true);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideContextMenu();
    hideNewMenu();
  }
  
  // Tab switching shortcuts: Cmd/Ctrl + 1/2/3
  const isMod = event.metaKey || event.ctrlKey;
  if (isMod && !event.shiftKey && !event.altKey) {
    switch (event.key) {
      case '1':
        event.preventDefault();
        setActive('preview');
        break;
      case '2':
        event.preventDefault();
        setActive('preview');
        break;
      case '3':
        event.preventDefault();
        setActive('code');
        break;
    }
  }
});

const idle = (cb: () => void) => (typeof window !== 'undefined' && 'requestIdleCallback' in window
  ? (window as any).requestIdleCallback(cb)
  : setTimeout(cb, 0));


function ensureCodeInitialized(): void {
  if (codeState.initialized) return;
  codeState.initialized = true;
  directoryCache.clear();
  expandedDirs.clear();
  loadingDirs.clear();
  expandedDirs.add(normalizeRel(codeState.dir));
  codeState.entries = [];
  if (CWD) updateWorkspaceChip(CWD);
  if (codeFileList) codeFileList.innerHTML = '<div class="code-item">Loading…</div>';
  void loadDir(codeState.dir);
}

function onWorkspaceChanged(cwd: string): void {
  // Stop auto-refresh during workspace change
  stopAutoRefresh();
  codeState.root = cwd;
  codeState.dir = '.';
  codeState.file = null;
  codeState.fileContent = '';
  codeState.dirty = false;
  codeState.initialized = false;
  codeState.entries = [];
  directoryCache.clear();
  expandedDirs.clear();
  loadingDirs.clear();
  expandedDirs.add('.');
  removeCreateFileForm();
  removeRenameForm();
  updateWorkspaceChip(cwd);
  if (codeSaveStatus) codeSaveStatus.textContent = '';
  updateEditorState();
  if (codeFileList) codeFileList.innerHTML = '<div class="code-item">Loading…</div>';
  // Always re-initialize to refresh the file browser
  ensureCodeInitialized();
  // Restart auto-refresh if code tab is active
  if (tabCode.classList.contains('active')) {
    startAutoRefresh();
  }
}

function setShellVisibility(shell: HTMLElement | null, active: boolean): void {
  if (!shell) return;
  shell.hidden = !active;
  shell.style.display = active ? '' : 'none';
}

// Track if initial terminal setup is in progress
let terminalInitPromise: Promise<void> | null = null;

// localStorage key for persisting the active child tab
const CHILD_TAB_STORAGE_KEY = 'bc.childTab';

function setActive(tab: 'preview' | 'terminal' | 'code', persist = false) {
  tabPreview.classList.toggle('active', tab === 'preview');
  tabTerminal.classList.toggle('active', tab === 'terminal');
  tabCode.classList.toggle('active', tab === 'code');

  // Persist user's tab selection if requested
  if (persist) {
    try {
      localStorage.setItem(CHILD_TAB_STORAGE_KEY, tab);
    } catch { }
  }

  const previewActive = tab === 'preview';
  const previewShouldShow = previewActive && browserVisible;
  const welcomeShouldShow = previewActive && !browserVisible;

  addressBar.hidden = !previewActive;
  setShellVisibility(previewTabbar, previewActive);
  setShellVisibility(browserShell, previewShouldShow);
  setShellVisibility(welcome, welcomeShouldShow);
  setShellVisibility(termShell, tab === 'terminal');
  setShellVisibility(codeShell, tab === 'code');
  if (previewActive) {
    const tabState = ensurePreviewTabExists();
    setActivePreviewTab(tabState);
    renderPreviewTabs();
    updatePreviewNavButtons();
  }

  if (tab === 'terminal') {
    // Start initialization if not already in progress
    if (!terminalInitPromise) {
      terminalInitPromise = initializeTerminals(true).finally(() => {
        terminalInitPromise = null;
      });
    } else {
      // Already initializing, just ensure we activate when done
      terminalInitPromise.then(() => {
        if (terminals.has(activeTerminalId)) {
          activateTerminal(activeTerminalId);
        }
      }).catch(() => {});
    }
  }
  if (tab === 'code') {
    ensureCodeInitialized();
    // Refresh the directory listing when switching to code tab
    if (codeState.initialized && !codeState.file) {
      loadDir(codeState.dir);
    }
    // Start auto-refresh when code tab is active
    startAutoRefresh();
  } else {
    // Stop auto-refresh when leaving code tab
    stopAutoRefresh();
  }
}

tabPreview?.addEventListener('click', () => setActive('preview', true));
tabTerminal?.addEventListener('click', () => setActive('terminal', true));
tabCode?.addEventListener('click', () => setActive('code', true));
terminalAddBtn?.addEventListener('click', () => { void handleAddTerminal(); });
terminalTabsEl?.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) return;
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  const tabs = Array.from(terminalTabsEl.querySelectorAll<HTMLButtonElement>('.terminal-tab'));
  if (tabs.length < 2) return;
  const target = event.target instanceof HTMLElement ? event.target.closest<HTMLButtonElement>('.terminal-tab') : null;
  let currentIndex = target ? tabs.indexOf(target) : -1;
  if (currentIndex < 0) {
    currentIndex = tabs.findIndex((tab) => tab.dataset.terminalId === activeTerminalId);
  }
  if (currentIndex < 0) currentIndex = 0;
  event.preventDefault();
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
  const nextTab = tabs[nextIndex];
  if (!nextTab) return;
  nextTab.focus();
  const nextId = nextTab.dataset.terminalId;
  if (nextId) activateTerminal(nextId, { focus: false });
});
previewTabAddBtn?.addEventListener('click', () => {
  const tab = createPreviewTab('about:blank');
  loadTabUrl(tab);
  setActive('preview');
  window.setTimeout(() => { try { input.focus(); input.select(); } catch { } }, 0);
});

window.addEventListener('beforeunload', () => {
  for (const unsub of terminalUnsubs) {
    try { unsub(); } catch { }
  }
  terminalUnsubs = [];
});

type PreviewCommandPayload = {
  requestId: string;
  action: 'navigate' | 'list' | 'get_active' | 'activate' | 'close' | 'refresh';
  params?: any;
};

(window as any).child?.onPreviewCommand?.((payload: PreviewCommandPayload) => {
  if (!payload || typeof payload.requestId !== 'string' || !payload.action) return;
  const respond = (result: any) => {
    try { (window as any).child?.emitPreviewCommandResult?.({ requestId: payload.requestId, result }); } catch { }
  };
  try {
    switch (payload.action) {
      case 'navigate': {
        const params = payload.params ?? {};
        const focus = params?.focus !== false;
        const openNew = params?.openNewTab === true;
        const targetId = typeof params?.tabId === 'string' ? params.tabId : null;
        let tab: PreviewTab;
        if (openNew) {
          tab = createPreviewTab('about:blank');
        } else if (targetId && previewTabs.has(targetId)) {
          tab = previewTabs.get(targetId)!;
        } else {
          tab = ensurePreviewTabExists();
        }
        const snapshot = navigateTab(tab, params?.url ?? 'about:blank', { push: params?.replace !== true, focus });
        respond({ ok: true, tab: snapshot });
        break;
      }
      case 'list': {
        const tabs = Array.from(previewTabs.values()).map(snapshotTab);
        respond({ ok: true, tabs, activeTabId: activePreviewTabId });
        break;
      }
      case 'get_active': {
        const active = getActivePreviewTab();
        respond({ ok: true, tab: active ? snapshotTab(active) : null });
        break;
      }
      case 'activate': {
        const params = payload.params ?? {};
        const tabId = typeof params?.tabId === 'string' ? params.tabId : null;
        const focus = params?.focus !== false;
        if (!tabId) throw new Error('tabId is required');
        const tab = activatePreviewTab(tabId);
        if (!tab) throw new Error('Tab not found');
        if (focus) setActive('preview');
        respond({ ok: true, tab: snapshotTab(tab) });
        break;
      }
      case 'close': {
        const params = payload.params ?? {};
        const tabId = typeof params?.tabId === 'string' ? params.tabId : null;
        const focus = params?.focus !== false;
        if (!tabId) throw new Error('tabId is required');
        const activeAfter = closePreviewTab(tabId);
        if (focus && activeAfter) setActive('preview');
        respond({ ok: true, activeTab: activeAfter ? snapshotTab(activeAfter) : null, tabs: Array.from(previewTabs.values()).map(snapshotTab) });
        break;
      }
      case 'refresh': {
        const params = payload.params ?? {};
        const tabId = typeof params?.tabId === 'string' ? params.tabId : null;
        const focus = params?.focus !== false;
        const tab = tabId ? previewTabs.get(tabId) : getActivePreviewTab();
        if (!tab) throw new Error('Tab not found');
        setActivePreviewTab(tab);
        loadTabUrl(tab);
        if (focus) setActive('preview');
        respond({ ok: true, tab: snapshotTab(tab) });
        break;
      }
      default:
        respond({ ok: false, error: `Unknown action: ${payload.action}` });
    }
  } catch (error) {
    respond({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

// Load persisted tab preference, default to 'preview' for first-time users
(() => {
  let initialTab: 'preview' | 'terminal' | 'code' = 'preview';
  try {
    const saved = localStorage.getItem(CHILD_TAB_STORAGE_KEY);
    if (saved === 'terminal' || saved === 'code' || saved === 'preview') {
      initialTab = saved;
    }
  } catch { }
  setActive(initialTab);
})();

(window as any).child?.onShowCode?.(async ({ path, rel, content, isDirectory }: { path: string; rel?: string; content: string; isDirectory?: boolean }) => {
  setActive('code');
  ensureCodeInitialized();
  const normalizedRoot = normalizeRel(codeState.root);
  const normalizedPath = normalizeRel(path);
  const relHint = rel ? normalizeRel(rel) : null;
  let relPath: string | null = relHint;
  if (!relPath || relPath === '.') relPath = relHint;
  if (normalizedRoot && normalizedPath.startsWith(normalizedRoot)) {
    relPath = normalizeRel(normalizedPath.slice(normalizedRoot.length).replace(/^\//, ''));
    if (!relPath || relPath === '') relPath = '.';
  }
  codeState.fileContent = content ?? '';
  codeState.dirty = false;
  if (isDirectory) {
    const targetDir = relPath ?? normalizeRel(relHint || normalizedPath || '.');
    if (targetDir) {
      codeState.dir = targetDir;
      codeState.file = null;
      codeState.fileContent = '';
      codeState.dirty = false;
      expandedDirs.add(targetDir);
      await ensurePathVisible(targetDir);
      updateEditorState();
      loadDir(targetDir).catch(() => { });
      setActive('code');
    }
    return;
  }
  if (relPath) {
    codeState.dir = parentDir(relPath);
    expandedDirs.add(codeState.dir);
    await ensurePathVisible(codeState.dir);
    codeState.file = relPath;
    updateEditorState();
    renderFileTree();
    void loadDir(codeState.dir, true);
    if (codeSaveStatus) {
      codeSaveStatus.textContent = '';
      codeSaveStatus.classList.remove('error');
    }
  } else {
    codeState.file = null;
    ensureEditor();
    if (codeBrowser) codeBrowser.hidden = true;
    if (codeEditorView) {
      codeEditorView.hidden = false;
      codeEditorView.parentElement?.classList.add('editor-active');
    }
    codeState.readOnly = true;
    configureEditorEditability(false);
    applyLanguageConfig(path, codeState.fileContent);
    setEditorContent(codeState.fileContent, false);
    updateDirtyState(false);
    if (codeEditorPath) codeEditorPath.textContent = path;
    if (codeSaveBtn) codeSaveBtn.disabled = true;
    if (codeSaveStatus) {
      codeSaveStatus.textContent = 'Non-workspace file (read only)';
      codeSaveStatus.classList.add('error');
    }
    
    // Check if this is a diff file and initialize diff sections with scroll listener
    const isDiff = path.toLowerCase().includes('.diff') || path.toLowerCase().includes('diff');
    if (isDiff && content) {
      // Use new initDiffSections which sets up scroll-based header updates
      initDiffSections(content);
    } else {
      hideDiffHeader();
    }
    
    renderFileTree();
    updateBackButtonState();
    updateCopyButtonState();
  }
});

// Allow main process (tools) to programmatically navigate the Preview panel
(window as any).child?.onSetPreviewUrl?.((payload: { url: string; focus?: boolean }) => {
  try {
    const raw = payload?.url || '';
    if (!raw) return;
    const url = normalizeAddress(raw);
    if (!url) return;
    // Switch to Preview tab if requested (default true)
    const shouldFocus = payload?.focus !== false;
    if (shouldFocus) setActive('preview');
    navigateTo(url, true);
  } catch { }
});

// Listen for tab switch commands from main renderer (via keyboard shortcuts)
(window as any).child?.onSwitchTab?.((payload: { tab: 'terminal' | 'preview' | 'code' }) => {
  try {
    const tab = payload?.tab;
    if (tab === 'terminal' || tab === 'preview' || tab === 'code') {
      setActive(tab);
    }
  } catch { }
});

(async () => {
  try {
    const info = await window.workspace?.get?.();
    if (info?.cwd) {
      CWD = info.cwd;
      codeState.root = info.cwd;
      updateWorkspaceChip(info.cwd);
    }
  } catch { }
})();

refreshBtn?.addEventListener('click', () => {
  if (tabCode.classList.contains('active')) {
    loadDir(codeState.dir);
  } else {
    const tab = getActivePreviewTab();
    if (tab && tab.history.length) {
      setActivePreviewTab(tab);
      loadTabUrl(tab);
    } else {
      triggerNavigate();
    }
  }
});

updateEditorState();
