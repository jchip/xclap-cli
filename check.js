"use strict";

const Fs = require("fs");
const isInstalledGlobally = require("is-installed-globally");
if (!isInstalledGlobally) {
  if (process.env.INIT_CWD === process.cwd()) {
    const pkg = JSON.parse(Fs.readFileSync("package.json").toString());
    if (pkg.name === "xclap-cli") {
      process.exit(0);
    }
  }

  console.error(
    `

xclap-cli is only intended to be installed globally:

  - npm:  'npm install -g xclap-cli'
  - yarn: 'yarn global add xclap-cli'

If you want to use the xclap task runner in your project, please install the xclap package.

Also, xclap has been renamed to @xarc/run and xclap-cli to @xarc/run-cli.  Please use that:

- @xarc/run:     https://www.npmjs.com/package/@xarc/run
- @xarc/run-cli: https://www.npmjs.com/package/@xarc/run-cli

`
  );
  process.exit(1);
}
