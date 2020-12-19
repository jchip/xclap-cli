#!/usr/bin/env node

"use strict";

const requireAt = require("require-at");
const Path = require("path");
const Fs = require("fs");

function findRunners() {
  const cwd = process.cwd().replace(/[\\/]/g, "/");

  return ["@xarc/run", "xclap"].reduce((runners, p) => {
    try {
      const cwdRequire = requireAt(process.cwd());
      const pkgPath = Path.dirname(cwdRequire.resolve(`${p}/package.json`));
      runners[p] = {
        path: pkgPath,
        inCwd: pkgPath.replace(/[\\/]/g, "/").startsWith(cwd)
      };
    } catch (err) {
      runners[p] = { path: false, inCwd: false, err };
    }
    return runners;
  }, {});
}

function hasXrunTaskFile() {
  return [".js", ".ts"].find(ext =>
    Fs.existsSync(Path.resolve("xrun-tasks" + ext))
  );
}

function findXclapPath() {
  const runners = findRunners();

  const msgWithXrun = `The module @xarc/run is detected in your project.  You may want to invoke your task with xrun.`;
  const msgInstallXrunCli = `You can invoke xrun with 'npx xrun' or 'xrun' by installing the command globally: 'npm i -g @xarc/run-cli'`;
  if (runners.xclap.path) {
    // xclap coming from upper directories?
    if (!runners.xclap.inCwd) {
      console.log(`
The module xclap is detected _outside_ of your current working dir.  This is not typically expected.
CWD: ${process.cwd()}
xclap: ${runners.xclap.path}
`);

      const xarcRun = runners["@xarc/run"];
      if (xarcRun.path && xarcRun.inCwd) {
        const xrunExt = hasXrunTaskFile();
        if (xrunExt) {
          // xrun-tasks file found, definitely want xrun
          console.log(`
The file 'xrun-tasks${xrunExt}' is found in your project.
${msgWithXrun}
${msgInstallXrunCli}

=== Invoking as xrun ===
`);
          require("./xrun");
          return false;
        }

        // @xarc/run found but no xrun-tasks - show message about xrun
        console.log(`
${msgWithXrun}
${msgInstallXrunCli}

a
`);
      }
    }
    return runners.xclap.path;
  } else {
    console.log(
      `
Cannot find the module xclap with require at CWD`,
      process.cwd()
    );

    let xrunExt;
    if (runners["@xarc/run"].path) {
      console.log(
        `
${msgWithXrun}
${msgInstallXrunCli}

=== Invoking as xrun ===
`
      );
      require("./xrun");
      return false;
    } else if ((xrunExt = hasXrunTaskFile())) {
      console.log(`The file 'xrun-tasks${xrunExt}' is found in your project.
You need @xarc/run for that.  Please install it with 'npm i --save-dev @xarc/run'
${msgInstallXrunCli}
`);
    } else {
      console.log(
        `Please double check you are in the right directory of your project.
You may need install the module xclap with 'npm install --save-dev xclap'
Also, xclap is now @xarc/run. Please see https://www.npmjs.com/package/@xarc/run.
`
      );
    }

    if (runners.xclap.err.code !== "MODULE_NOT_FOUND") {
      console.log("Actual Error", runners.xclap.err);
    }
    process.exit(1);
  }
}

function checkCompletion() {
  const argv = process.argv;
  const usage = () => {
    console.log("echo Usage: clap --completion=bash|zsh");
    return process.exit(1);
  };

  if (argv.length === 3 && argv[2].startsWith("--completion")) {
    const x = argv[2].indexOf("=");

    if (x < 0) return usage();
    const shell = argv[2].substr(x + 1).trim();
    if (shell === "") return usage();
    const fname = Path.join(__dirname, "completion", shell);
    if (Fs.existsSync(fname)) {
      console.log(Fs.readFileSync(fname).toString());
    } else {
      console.log(`echo no completion found for ${shell}`);
      return process.exit(1);
    }
    return process.exit(0);
  }

  return false;
}

const xclapPath = findXclapPath();

if (xclapPath) {
  checkCompletion();
  require(Path.join(xclapPath, "cli/clap"))();
}
