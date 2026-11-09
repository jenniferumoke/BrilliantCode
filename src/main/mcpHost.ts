// Lightweight MCP host/adapter for BrilliantCode (Electron main process)
// - Loads MCP server config from workspace and user-level JSON
// - Spawns stdio servers, connects a client via official MCP TypeScript client
// - Exposes flattened tool schemas and handlers consumable by AgentSession
// - Provides IPC-friendly list/connect/disconnect/status helpers per window

import * as path from 'node:path';
import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import { app } from 'electron';
import type { BrowserWindow } from 'electron';

type McpServerConfig = {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;          // resolved relative to workingDir
  transport?: 'stdio';   // MVP: stdio only
  url?: string;          // reserved for future transports
  timeoutMs?: number;    // optional override for connect timeout
  maxTotalTimeoutMs?: number; // optional override for total timeout window
};

type McpConfig = Record<string, McpServerConfig>;

type McpTool = { name: string; description?: string; inputSchema?: any };

type ConnectedServer = {
  name: string;
  cfg: McpServerConfig;
  transport: any;
  client: any; // MCP client instance (typed as any to avoid tight coupling)
  tools: McpTool[];
  resources: { uri: string; name?: string }[];
  status: 'starting' | 'ready' | 'error' | 'stopped';
  error?: string;
};

type WindowState = {
  workingDir: string;
  servers: Map<string, ConnectedServer>;
  config: McpConfig;
  // Servers whose effective config came from the workspace (package.json),
  // i.e. from whatever repository is open rather than from the user.
  workspaceNames: Set<string>;
};

export type WorkspaceServerApprovalRequest = {
  winId: number;
  name: string;
  workingDir: string;
  command: string;
  args: string[];
  cwd: string;
  envKeys: string[];
};

export type WorkspaceServerApprover = (req: WorkspaceServerApprovalRequest, win?: BrowserWindow) => Promise<boolean>;

// Utility: safe read JSON file
function readJson(file: string): any | null {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function normalizeServerConfig(input: any): McpServerConfig {
  const command = typeof input?.command === 'string' ? input.command : '';
  const args = Array.isArray(input?.args)
    ? input.args.filter((item: any) => typeof item === 'string').map((item: string) => item)
    : [];
  const env = input?.env && typeof input.env === 'object' && !Array.isArray(input.env)
    ? Object.fromEntries(Object.entries(input.env).filter(([, v]) => typeof v === 'string')) as Record<string, string>
    : undefined;
  const cwd = typeof input?.cwd === 'string' ? input.cwd : undefined;
  const transport = 'stdio'; // Default to stdio for MCP servers
  const url = typeof input?.url === 'string' ? input.url : undefined;
  const timeoutMsRaw = Number(input?.timeoutMs);
  const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? timeoutMsRaw : undefined;
  const maxTimeoutRaw = Number(input?.maxTotalTimeoutMs);
  const maxTotalTimeoutMs = Number.isFinite(maxTimeoutRaw) && maxTimeoutRaw > 0 ? maxTimeoutRaw : undefined;

  const cfg: McpServerConfig = {
    command,
    args,
    transport, // Always include transport (defaults to 'stdio')
  };
  if (env && Object.keys(env).length) cfg.env = env;
  if (cwd) cfg.cwd = cwd;
  if (url) cfg.url = url;
  if (timeoutMs) cfg.timeoutMs = timeoutMs;
  if (maxTotalTimeoutMs) cfg.maxTotalTimeoutMs = maxTotalTimeoutMs;
  return cfg;
}

function mergeConfigSource(target: McpConfig, source: any): void {
  if (!source || typeof source !== 'object') return;

  // Only look for mcpServers key - don't fallback to the entire source object
  const mcpServers = (source as any).mcpServers;
  if (!mcpServers || typeof mcpServers !== 'object' || Array.isArray(mcpServers)) {
    return; // No valid mcpServers config found
  }

  for (const [name, value] of Object.entries(mcpServers)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    target[name] = normalizeServerConfig(value);
  }
}

// Load MCP config from workspace (package.json -> mcpServers) and user (~/.brilliantcode/mcp.json)
function loadMcpConfig(workingDir: string): { config: McpConfig; workspaceNames: Set<string> } {
  const merged: McpConfig = {};
  try {
    const pkgPath = path.join(workingDir, 'package.json');
    const pkg = readJson(pkgPath);
    mergeConfigSource(merged, pkg);
  } catch {}
  const workspaceConfig: McpConfig = { ...merged };
  try {
    const home = process.env.HOME || process.env.USERPROFILE || '';
    if (home) {
      const userCfgPath = path.join(home, '.brilliantcode', 'mcp.json');
      const userCfg = readJson(userCfgPath);
      mergeConfigSource(merged, userCfg);
    }
  } catch {}
  // A name counts as workspace-sourced only if the user config did not
  // replace it with its own definition.
  const workspaceNames = new Set<string>(
    Object.keys(workspaceConfig).filter((name) => merged[name] === workspaceConfig[name])
  );
  return { config: merged, workspaceNames };
}

// Attempt to require the official MCP client + stdio transport at runtime.
function loadMcpLibraries(): {
  ok: boolean;
  clientCtor?: any;
  stdioTransportCtor?: any;
  error?: string;
} {
  try {
    const req = createRequire(import.meta.url);
    const tryRequire = (specifier: string): any => {
      try { return req(specifier); } catch { return undefined; }
    };
    const extractCtor = (mod: any, keys: string[]): any => {
      if (!mod) return undefined;
      for (const key of keys) {
        const value = mod?.[key];
        if (typeof value === 'function') return value;
      }
      if (typeof mod === 'function') return mod;
      if (mod?.default && mod.default !== mod) {
        return extractCtor(mod.default, keys);
      }
      return undefined;
    };

    const sdkRoot = tryRequire('@modelcontextprotocol/sdk');

    const clientSources = [
      sdkRoot,
      sdkRoot?.client,
      tryRequire('@modelcontextprotocol/sdk/client'),
      tryRequire('@modelcontextprotocol/sdk/client/index.js'),
      tryRequire('@modelcontextprotocol/sdk/dist/cjs/client/index.js'),
      tryRequire('@modelcontextprotocol/sdk/dist/esm/client/index.js'),
    ];
    let clientCtor: any;
    for (const source of clientSources) {
      clientCtor = extractCtor(source, ['Client', 'McpClient']);
      if (clientCtor) break;
    }
    if (!clientCtor) {
      const altClient = tryRequire('@modelcontextprotocol/client');
      clientCtor = extractCtor(altClient, ['Client', 'McpClient']);
    }

    const stdioSources = [
      sdkRoot,
      sdkRoot?.client,
      tryRequire('@modelcontextprotocol/sdk/client/stdio'),
      tryRequire('@modelcontextprotocol/sdk/client/stdio.js'),
      tryRequire('@modelcontextprotocol/sdk/client/stdio/index.js'),
      tryRequire('@modelcontextprotocol/sdk/dist/cjs/client/stdio.js'),
      tryRequire('@modelcontextprotocol/sdk/dist/esm/client/stdio.js'),
      tryRequire('@modelcontextprotocol/client/stdio'),
      tryRequire('@modelcontextprotocol/client/stdio.js'),
    ];
    let stdioCtor: any;
    for (const source of stdioSources) {
      stdioCtor = extractCtor(source, ['StdioClientTransport', 'StdioTransport']);
      if (stdioCtor) break;
    }

    if (clientCtor && stdioCtor) {
      return { ok: true, clientCtor, stdioTransportCtor: stdioCtor };
    }

    const missing: string[] = [];
    if (!clientCtor) missing.push('Client');
    if (!stdioCtor) missing.push('StdioClientTransport');
    return {
      ok: false,
      error: `Missing MCP ${missing.join(' & ')} export. Ensure @modelcontextprotocol/sdk is installed and exposes client + stdio transport.`
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export class McpHost {
  private windows = new Map<number, WindowState>();
  private workspaceApprover: WorkspaceServerApprover | null = null;
  private approvedWorkspaceServers = new Set<string>();

  /**
   * Opening a repository must not be enough to run code from it. Servers
   * defined in a workspace's package.json are only spawned after this
   * approver (a dialog showing the exact command) says yes. Without an
   * approver, workspace servers are refused.
   */
  setWorkspaceServerApprover(fn: WorkspaceServerApprover | null): void {
    this.workspaceApprover = fn;
  }

  async prepare(winId: number, workingDir: string): Promise<void> {
    const dir = path.resolve(workingDir || process.cwd());
    let st = this.windows.get(winId);
    if (!st) {
      st = { workingDir: dir, servers: new Map(), config: {}, workspaceNames: new Set() };
      this.windows.set(winId, st);
    }
    if (st.workingDir !== dir) {
      // Workspace changed: stop existing servers, reload config
      await this.stopAllInternal(st);
      st.workingDir = dir;
    }
    const loaded = loadMcpConfig(dir);
    st.config = loaded.config;
    st.workspaceNames = loaded.workspaceNames;
  }

  getStatus(winId: number): { workingDir: string; servers: { name: string; status: string; error?: string; tools?: number }[]; config: McpConfig } {
    const st = this.windows.get(winId);
    if (!st) return { workingDir: '', servers: [], config: {} };
    const servers = Array.from(st.servers.values()).map(s => ({ name: s.name, status: s.status, error: s.error, tools: s.tools?.length || 0 }));
    return { workingDir: st.workingDir, servers, config: st.config };
  }

  listConfigured(winId: number): { ok: boolean; servers: { name: string; config: McpServerConfig; connected: boolean; status?: string; tools?: number; error?: string }[] } {
    const st = this.windows.get(winId);
    if (!st) return { ok: true, servers: [] };
    const out: { name: string; config: McpServerConfig; connected: boolean; status?: string; tools?: number; error?: string }[] = [];
    const names = new Set<string>([...Object.keys(st.config), ...Array.from(st.servers.keys())]);
    for (const name of names) {
      const cfg = st.config[name];
      const conn = st.servers.get(name);
      out.push({
        name,
        config: cfg || { command: '' },
        connected: !!conn,
        status: conn?.status,
        tools: conn?.tools?.length,
        error: conn?.error,
      });
    }
    return { ok: true, servers: out };
  }

  // Connect one configured server by name (spawn stdio and create client)
  async connect(winId: number, name: string, win?: BrowserWindow): Promise<{ ok: boolean; error?: string }> {
    const st = this.windows.get(winId);
    if (!st) return { ok: false, error: 'no-window' };
    const cfg = st.config[name];
    if (!cfg || !cfg.command) return { ok: false, error: 'not-configured' };

    if (st.servers.has(name)) return { ok: true }; // already connected

    if (st.workspaceNames.has(name)) {
      const cwdForApproval = path.resolve(st.workingDir, cfg.cwd || '.');
      const approvalKey = JSON.stringify([st.workingDir, name, cfg.command, cfg.args || [], cwdForApproval, cfg.env || {}]);
      if (!this.approvedWorkspaceServers.has(approvalKey)) {
        if (!this.workspaceApprover) return { ok: false, error: 'Workspace MCP servers require approval.' };
        let approved = false;
        try {
          approved = await this.workspaceApprover({
            winId,
            name,
            workingDir: st.workingDir,
            command: cfg.command,
            args: Array.isArray(cfg.args) ? cfg.args : [],
            cwd: cwdForApproval,
            envKeys: Object.keys(cfg.env || {}),
          }, win);
        } catch {
          approved = false;
        }
        if (!approved) return { ok: false, error: 'Connection cancelled: workspace MCP server was not approved.' };
        this.approvedWorkspaceServers.add(approvalKey);
      }
    }

    const libs = loadMcpLibraries();
    if (!libs.ok) return { ok: false, error: libs.error || 'mcp-client-not-installed' };

    let transport: any;
    let client: any;
    let server: ConnectedServer | null = null;
    try {
      const cwd = path.resolve(st.workingDir, cfg.cwd || '.');
      transport = new libs.stdioTransportCtor({
        command: cfg.command,
        args: Array.isArray(cfg.args) ? cfg.args : [],
        env: { ...process.env, ...(cfg.env || {}) },
        cwd,
        stderr: 'pipe',
      });

      const clientInfo = {
        name: 'BrilliantCode',
        version: (() => {
          try { return app.getVersion(); } catch { return 'dev'; }
        })(),
      };
      client = new libs.clientCtor(clientInfo);

      server = {
        name,
        cfg,
        transport,
        client,
        tools: [],
        resources: [],
        status: 'starting'
      };
      st.servers.set(name, server);

      const timeoutMs = (() => {
        const raw = Number(cfg.timeoutMs);
        if (Number.isFinite(raw) && raw > 0) return Math.max(1000, raw);
        return 120_000; // default to 2 minutes to allow cold starts (npx installs, etc.)
      })();
      const maxTotalTimeout = (() => {
        const raw = Number(cfg.maxTotalTimeoutMs);
        if (Number.isFinite(raw) && raw > 0) return Math.max(timeoutMs, raw);
        return timeoutMs * 2;
      })();

      await client.connect(transport, {
        timeout: timeoutMs,
        maxTotalTimeout,
        resetTimeoutOnProgress: true,
      });

      // Read tools/resources lists
      try {
        const toolsResp = await (client.listTools?.() ?? client.tools?.list?.());
        const tools: McpTool[] = Array.isArray(toolsResp?.tools) ? toolsResp.tools : (Array.isArray(toolsResp) ? toolsResp : []);
        server.tools = tools.map((t: any) => ({ name: String(t?.name || ''), description: t?.description, inputSchema: t?.inputSchema || t?.input_schema }));
      } catch (e: any) {
        server.tools = [];
      }
      try {
        const resResp = await (client.listResources?.() ?? client.resources?.list?.());
        const resources = Array.isArray(resResp?.resources) ? resResp.resources : (Array.isArray(resResp) ? resResp : []);
        server.resources = resources.map((r: any) => ({ uri: String(r?.uri || ''), name: r?.name }));
      } catch {
        server.resources = [];
      }

      server.status = 'ready';
      try { win?.webContents.send('ai:notice', { text: `MCP(${name}) connected with ${server.tools.length} tool(s)` }); } catch {}
      // Log child stderr as notices to aid debugging
      try {
        const stderrStream = server.transport?.stderr ?? server.transport?._stderrStream;
        stderrStream?.on('data', (buf: Buffer) => {
          const m = String(buf || '').trim();
          if (m) try { win?.webContents.send('ai:notice', { text: `MCP(${name}) stderr: ${m.slice(0, 2000)}` }); } catch {}
        });
      } catch {}

      // Handle unexpected exit
      server.client.onclose = () => {
        if (!server) return;
        server.status = 'stopped';
        server.error = 'transport closed';
        try { win?.webContents.send('ai:notice', { text: `MCP(${name}) exited: transport closed` }); } catch {}
        st.servers.delete(name);
        server = null;
      };

      const underlyingProc = server.transport?._process;
      underlyingProc?.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
        if (!server) return;
        server.status = 'stopped';
        server.error = `exit ${code ?? 'null'} ${signal ?? ''}`.trim();
        try { win?.webContents.send('ai:notice', { text: `MCP(${name}) exited: ${server.error}` }); } catch {}
        st.servers.delete(name);
        server = null;
      });

      return { ok: true };
    } catch (e: any) {
      const message = e?.message || String(e);
      try { await client?.close?.(); } catch {}
      try { await transport?.close?.(); } catch {}
      try { transport?._process?.kill?.(); } catch {}
      try { win?.webContents.send('ai:notice', { text: `MCP(${name}) connect failed: ${message}` }); } catch {}
      st.servers.delete(name);
      return { ok: false, error: message };
    }
  }

  async disconnect(winId: number, name: string): Promise<{ ok: boolean; error?: string }> {
    const st = this.windows.get(winId);
    if (!st) return { ok: false, error: 'no-window' };
    const conn = st.servers.get(name);
    if (!conn) return { ok: true };
    try {
      try { await conn.client?.close?.(); } catch {}
      try { await conn.transport?.close?.(); } catch {}
    } finally {
      st.servers.delete(name);
    }
    return { ok: true };
  }

  async stopAll(winId: number): Promise<void> {
    const st = this.windows.get(winId);
    if (!st) return;
    await this.stopAllInternal(st);
  }

  private async stopAllInternal(st: WindowState): Promise<void> {
    const servers = Array.from(st.servers.values());
    st.servers.clear();
    for (const s of servers) {
      try { await s.client?.close?.(); } catch {}
      try { await s.transport?.close?.(); } catch {}
    }
  }

  // Construct tool schema entries and handlers to merge into AgentSession
  adaptersForWindow(winId: number): { schema: any[]; handlers: Record<string, (args: any) => Promise<any>> } {
    const st = this.windows.get(winId);
    if (!st) return { schema: [], handlers: {} };

    const schema: any[] = [];
    const handlers: Record<string, (args: any) => Promise<any>> = {};

    for (const [name, conn] of st.servers.entries()) {
      if (conn.status !== 'ready') continue;
      const prefix = `mcp__${name}__`;
      for (const tool of conn.tools) {
        const fn = `${prefix}${tool.name}`;
        schema.push({
          type: 'function',
          name: fn,
          description: `MCP(${name}): ${tool.description || tool.name}`,
          parameters: tool.inputSchema || { type: 'object', additionalProperties: true },
        });
        handlers[fn] = async (args: any) => {
          try {
            // Support both callTools API styles
            const res = await (conn.client.callTool?.(tool.name, args) ?? conn.client.tools?.call?.(tool.name, args));
            // Normalize output shape
            if (res && typeof res === 'object') {
              const content = (res?.content ?? res?.result ?? res);
              return { ok: true, data: content };
            }
            return { ok: true, data: res };
          } catch (e: any) {
            return { ok: false, error: e?.message || String(e) };
          }
        };
      }

      // Generic resource reader for this server
      if (conn.resources && conn.resources.length > 0) {
        const fn = `${prefix}read_resource`;
        schema.push({
          type: 'function',
          name: fn,
          description: `MCP(${name}): Read a resource by URI`,
          parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
              uri: { type: 'string' },
              version: { type: 'string' },
            },
            required: ['uri']
          }
        });
        handlers[fn] = async (args: any) => {
          try {
            const res = await (conn.client.readResource?.(args?.uri, args?.version) ?? conn.client.resources?.read?.(args?.uri, { version: args?.version }));
            return { ok: true, data: res };
          } catch (e: any) {
            return { ok: false, error: e?.message || String(e) };
          }
        };
      }
    }

    return { schema, handlers };
  }
}
