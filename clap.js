#!/usr/bin/env node

"use strict";

const requireAt = require("require-at");
const Path = require("path");

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

require(Path.join(findXclapPath(), "cli/clap"))();
