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

function hasXclapTaskFile() {
  return [".js", ".ts"].find(ext => Fs.existsSync(Path.resolve("xclap" + ext)));
}

function findXrunPath() {
  const runners = findRunners();
  const myRunnerName = "@xarc/run";

  const xarcRun = runners[myRunnerName];
  const xclap = runners.xclap;

  const msgUseXclap = `The module xclap is detected in your project.  You probably should use 'npx clap' to invoke your task.`;
  const msgUpdateXrun = `Please note that xclap has been renamed to ${myRunnerName}.  Please consider switching to it.`;
  if (xarcRun.path) {
    // @xarc/run coming from upper directories?
    if (!xarcRun.inCwd) {
      console.log(`
The module ${myRunnerName} is detected _outside_ of your current working dir.  This is not typically expected.
CWD: ${process.cwd()}
${myRunnerName}: ${xarcRun.path}
`);

      if (xclap.path && xclap.inCwd) {
        const xclapExt = hasXclapTaskFile();
        if (xclapExt) {
          // xclap file found, may need clap, but show update info for @xarc/run
          console.log(`
The file 'xclap${xclapExt}' is found in your project.
${msgUseXclap}
${msgUpdateXrun}
`);
          process.exit(1);
        }

        // xclap found but no xclap.js - show update info for @xarc/run
        console.log(`
${msgUseXclap}
${msgUpdateXrun}
`);
      }
    }
    return xarcRun.path;
  } else {
    console.log(
      `
Cannot find the module ${myRunnerName} with require at CWD`,
      process.cwd()
    );

    let xclapExt;
    if (xclap.path) {
      console.log(
        `
${msgUseXclap}
${msgUpdateXrun}
`
      );
    } else if ((xclapExt = hasXclapTaskFile())) {
      console.log(`The file 'xclap${xclapExt}' is found in your project.
You should rename it to 'xrun-tasks${xclapExt}' and update to '${myRunnerName}'
${msgUpdateXrun}
`);
    } else {
      console.log(
        `Please double check you are in the right directory of your project.
You may need install the module ${myRunnerName} with 'npm install --save-dev ${myRunnerName}'
`
      );
    }

    if (xarcRun.err.code !== "MODULE_NOT_FOUND") {
      console.log("Actual Error", xarcRun.err);
    }
    process.exit(1);
  }
}

function checkCompletion() {
  const argv = process.argv;
  const usage = () => {
    console.log("echo Usage: xrun --completion=bash|zsh");
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

checkCompletion();
require(Path.join(findXrunPath(), "cli/xrun"))();
