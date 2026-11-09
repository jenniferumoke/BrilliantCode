# Security Policy

BrilliantCode is a desktop IDE with an AI agent that can read and write files and run commands on your machine, so we take security reports seriously and appreciate responsible disclosure.

## Supported versions

Security fixes are released for the latest published version of BrilliantCode. If you are on an older version, please update before reporting, as the issue may already be fixed.

| Version         | Supported |
| --------------- | --------- |
| Latest release  | ✅        |
| Older releases  | ❌        |

## Reporting a vulnerability

**Please do not report security issues in public GitHub issues, pull requests, discussions or social media.** Public disclosure before a fix is available puts users at risk.

Report privately through GitHub:

1. Go to the [Security tab](https://github.com/jenniferumoke/BrilliantCode/security) of this repository.
2. Click **Report a vulnerability**.
3. Fill in the form with the details below.

A useful report includes:

- The BrilliantCode version and operating system you tested on.
- A description of the issue and its impact (for example: what an attacker controls, and what they can achieve).
- Step-by-step reproduction instructions, and a minimal proof of concept if you have one (for example a sample repository, file or URL).
- Any suggested fix or mitigation.

## What to expect

- **Acknowledgement** within 5 working days.
- **Initial assessment** (whether we can reproduce it and how severe we consider it) within 10 working days.
- **Fix timeline** depends on severity; we aim to ship fixes for critical issues as quickly as possible and will keep you updated.
- **Credit**: with your permission, we are happy to credit you in the release notes once a fix is published.

BrilliantCode does not currently run a paid bug bounty programme. We are grateful for reports, but we do not offer payment for them, and we will not respond to demands for payment as a condition of disclosure.

## Scope

In scope:

- The BrilliantCode desktop application (Electron main process, preload, renderer, and bundled agent).
- Ways that untrusted content — a cloned repository, a web page, a file, model output or an MCP server response — can run code, read or write files, or access credentials without the user's approval.
- The auto-update and version-check mechanisms.

Out of scope:

- Actions the agent takes in **auto mode** that the user asked for or that are an expected consequence of running commands in their own workspace. Auto mode intentionally runs commands without per-step confirmation (high-risk command patterns still require approval).
- MCP servers or commands that the user configured themselves.
- Vulnerabilities in third-party AI providers, or in dependencies with no demonstrated impact on BrilliantCode.
- Issues that require an already-compromised machine or physical access.
- Social engineering of maintainers or users.

## Safe harbour

We will not pursue legal action against anyone who, in good faith, researches and reports a vulnerability according to this policy: testing only against their own installation and data, avoiding harm to other users, and giving us reasonable time to fix the issue before any public disclosure.
