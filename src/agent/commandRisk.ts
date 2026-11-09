// Heuristics for terminal commands that should always need a human "yes",
// even in auto mode.
//
// Auto mode exists so the agent can run builds, tests and dev servers without
// a prompt for every step. The risk is prompt injection: a README, AGENTS.md,
// web page or tool result can tell the model to run something. These patterns
// cover the usual shapes of a malicious payload (download-and-execute, encoded
// blobs, reverse shells, persistence, credential access). It is a speed bump,
// not a sandbox — anything that matches simply falls back to the normal
// confirmation dialog.

const HIGH_RISK_PATTERNS: Array<{ re: RegExp; reason: string }> = [
  { re: /\b(curl|wget|fetch|iwr|invoke-webrequest|irm|invoke-restmethod)\b[^\n|;&]*\|\s*(sudo\s+)?(ba|z|da|k|fi)?sh\b/i, reason: 'downloads and pipes into a shell' },
  { re: /\b(curl|wget)\b[^\n|;&]*\|\s*(sudo\s+)?(python[0-9.]*|node|perl|ruby|php)\b/i, reason: 'downloads and pipes into an interpreter' },
  { re: /\|\s*(iex|invoke-expression)\b/i, reason: 'pipes into Invoke-Expression' },
  { re: /\b(ba|z|da|k)?sh\s+-c\s+["']?\$\((curl|wget)/i, reason: 'executes downloaded content' },
  { re: /\bsource\s+<\(\s*(curl|wget)/i, reason: 'sources downloaded content' },
  { re: /\bbase64\s+(-d|--decode|-D)\b/i, reason: 'decodes base64 (common for hidden payloads)' },
  { re: /\b(powershell|pwsh)(\.exe)?\b[^\n]*\s-(e|ec|enc|encodedcommand)\b/i, reason: 'runs an encoded PowerShell command' },
  { re: /\beval\s*["'`(]?\s*\$\(/i, reason: 'evals command output' },
  { re: /\b(nc|ncat|netcat|socat)\b[^\n]*\s-(e|c)\b/i, reason: 'possible reverse shell' },
  { re: /\/dev\/tcp\//i, reason: 'opens a raw TCP connection' },
  { re: /\b(python[0-9.]*|perl|ruby|php)\s+-[ce]\s+["'][^\n]*\b(socket|subprocess|os\.system|exec|pty\.spawn)\b/i, reason: 'inline interpreter code that spawns processes or sockets' },
  { re: /(^|[\s;&|])sudo\b/i, reason: 'uses sudo' },
  { re: /\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b/i, reason: 'recursive force delete' },
  { re: /(~|\$HOME|\/Users\/[^/\s]+|\/home\/[^/\s]+)\/\.(ssh|aws|azure|kube|gnupg|docker|config\/gcloud|netrc|npmrc|pypirc)\b/i, reason: 'touches credential files' },
  { re: /(>>?|\btee\b(\s+-a)?)\s*(~|\$HOME)?\/?[^\s]*\.(bashrc|zshrc|bash_profile|profile|zprofile|zshenv)\b/i, reason: 'modifies shell startup files' },
  { re: /\b(crontab|launchctl\s+(load|bootstrap)|systemctl\s+(--user\s+)?enable|schtasks)\b/i, reason: 'installs a persistent job' },
  { re: /Library\/LaunchAgents|Library\/LaunchDaemons/i, reason: 'touches launch agents' },
  { re: /\b(security\s+(find|dump)-(generic|internet)-password|security\s+dump-keychain)\b/i, reason: 'reads the macOS keychain' },
  { re: /\bchmod\s+[^\n]*\+?[0-7]*x[^\n]*&&\s*\.\//i, reason: 'marks a file executable and runs it' },
  { re: /\bxattr\s+-[a-z]*d[a-z]*\s+com\.apple\.quarantine/i, reason: 'removes the macOS quarantine flag' },
];

export type CommandRisk = { risky: boolean; reasons: string[] };

/** Classify a terminal command string. */
export function assessCommandRisk(command: unknown): CommandRisk {
  if (typeof command !== 'string' || !command.trim()) return { risky: false, reasons: [] };
  const reasons: string[] = [];
  for (const { re, reason } of HIGH_RISK_PATTERNS) {
    if (re.test(command)) reasons.push(reason);
  }
  return { risky: reasons.length > 0, reasons };
}
