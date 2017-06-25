#!/usr/bin/env node

"use strict";

const requireAt = require("require-at");
const Path = require("path");
const Fs = require("fs");

function findXclapPath() {
  try {
    const cwdRequire = requireAt(process.cwd());
    return Path.dirname(cwdRequire.resolve("xclap/package.json"));
  } catch (err) {
    console.log("Cannot find the module xclap at CWD", process.cwd());
    console.log("Please install it with 'npm install xclap'");
    if (err.code !== "MODULE_NOT_FOUND") {
      console.log("\nActual Error", err);
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

checkCompletion();
require(Path.join(findXclapPath(), "cli/clap"))();
