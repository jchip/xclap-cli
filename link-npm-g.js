"use strict";

const Fs = require("fs").promises;
const Path = require("path");
const which = require("which");

async function linkNpmG() {
  const clap = await which("clap");
  const realPath = await Fs.realpath(clap);
  const main = Path.join(__dirname, "clap.js");
  await Fs.writeFile(
    realPath,
    `#!/usr/bin/env node
"use strict";
require("${main}");
`
  );
}

linkNpmG();
