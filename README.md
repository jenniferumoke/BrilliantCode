
### BrilliantCode - Your open source AI engineer

[![BrilliantCode](assets/brilliant-code-image.png)](https://jcumoke.com/bcode)

BrilliantCode is an open-source agentic IDE that enables frontier models (including open source models) to build projects for you autonomously. Inside BrilliantCode, an LLM can spin up terminals, control a browser and create/edit files the same way you can as a dev. Transparency and control for human devs and agency for LLMs.

## Getting started

BrilliantCode is distributed as source code only. There are no pre-built downloads: you build the app on your own machine from this repository. That keeps what you run exactly in step with the code you can read here, and lets the project ship fixes as code changes without maintaining signed installers for every platform.

1. Build and run BrilliantCode from source (see [Building from source](#building-from-source) below).

2. Use your ChatGPT subscription OR add your API Keys.

	1. Go to AI -> Sign in with ChatGPT
	![Sign in with ChatGPT](assets/sign-in-with-chatgpt-in-bcode.png)

	2.  Add an API key
	![Add API Keys](assets/add-api-keys.png)

3. Select a model

	1. ![Select Model](assets/select-model.png)

	2. You can also add custom models

		![Add New Model](assets/add-new-model.png)

4. Create a project or open an existing project

   ![Choose a Project](assets/choose-a-project.png)

5. Tell the agent want to do.

  ![Send a Message](assets/send-a-message.png)
  
## Building from source

You can either **run the app straight from the source folder** (quickest, good for trying it out or hacking on it), or **package it into a normal desktop app** (a `.dmg` on macOS, an installer on Windows, an AppImage on Linux) that you install and launch like any other application.

### 1. Install the prerequisites

BrilliantCode is an Electron app. Two of its dependencies, the terminal (`node-pty`) and the secure key store (`keytar`), are native modules that get compiled on your machine, so you need a C/C++ toolchain as well as Node.js.

| | What to install |
| --- | --- |
| **All platforms** | [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) **20 LTS or newer** (the official builds are made with Node 20), plus Python 3 |
| **macOS** | Xcode Command Line Tools: `xcode-select --install` |
| **Windows** | [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the **Desktop development with C++** workload, and Python 3 from python.org or the Microsoft Store |
| **Linux (Debian/Ubuntu)** | `sudo apt install build-essential python3 libsecret-1-dev` |
| **Linux (Fedora)** | `sudo dnf install gcc-c++ make python3 libsecret-devel` |

### 2. Get the code and install dependencies

```bash
git clone https://github.com/jenniferumoke/BrilliantCode.git
cd BrilliantCode
npm ci
```

`npm ci` installs the exact dependency versions in `package-lock.json`. It's more reproducible than `npm install`, so stick with it unless you're changing dependencies.

### 3a. Run it from source

```bash
npm run rebuild    # compile node-pty and keytar for Electron
npm run run:dist   # build the app and launch it
```

You need `npm run rebuild` because `npm ci` compiles the native modules for your system's Node.js, while Electron ships its own Node.js version. Run it again whenever you reinstall dependencies or Electron is upgraded. If the terminal panel or saving API keys fails with a "module was compiled against a different Node.js version" error, it means this step was skipped.

If you're working on BrilliantCode itself, use `npm run dev` instead of `npm run run:dist`. It starts the app with hot reload and watchers for the main and preload code.

### 3b. Or package it as a desktop app

Packaging recompiles the native modules for you, so you don't need `npm run rebuild` here. The finished app is written to the `release/` folder.

**macOS** (creates a `.dmg` and `.zip` for your Mac's architecture):

```bash
CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist
```

Open the `.dmg` in `release/` and drag BrilliantCode to Applications. The app isn't code-signed. `CSC_IDENTITY_AUTO_DISCOVERY=false` stops the build from trying to sign it with a certificate it finds in your keychain. Because you built it on this Mac, macOS won't quarantine it and it opens normally. If you copy it to another Mac, right-click it and choose **Open** the first time.

**Windows** (creates an NSIS installer; use `--arm64` instead of `--x64` on ARM devices):

```powershell
npm run build
npx electron-builder --win nsis --x64 --config electron-builder.config.cjs --publish=never
```

Run the `.exe` in `release\`. It's unsigned, so Windows SmartScreen may show a warning. Choose **More info** → **Run anyway**.

**Linux** (creates an AppImage; use `--arm64` on ARM machines):

```bash
npm run build
npx electron-builder --linux AppImage --x64 --config electron-builder.config.cjs --publish=never
chmod +x release/*.AppImage
./release/brilliantcode-open-*.AppImage
```

If you'd rather install a package, replace `AppImage` with `deb` or `rpm`. Building an `rpm` needs `rpmbuild` (`sudo apt install rpm` or `sudo dnf install rpm-build`).

### Updating

Apps you build yourself don't auto-update. To get the latest changes, pull and rebuild:

```bash
git pull
npm ci
```

Then repeat step 3a or 3b. Watch the repository (**Watch → Custom → Releases** and **Security alerts** on GitHub) so you hear about important fixes.

### Troubleshooting the build

- **`gyp ERR!` during `npm ci` or `npm run rebuild`**: the C/C++ toolchain or Python is missing. Recheck the prerequisites for your platform.
- **`keytar` fails on Linux**: install `libsecret-1-dev` (Debian/Ubuntu) or `libsecret-devel` (Fedora), then run `npm ci` again.
- **The app opens but the terminal is blank or API keys won't save**: run `npm run rebuild`, then launch again.

See the [Troubleshooting section of the docs](DOCS.md#troubleshooting) for issues that come up after the app is running.

## Documentation

Read the documentation to learn more about how BrilliantCode works under the hood:

[Documentation](DOCS.md)
