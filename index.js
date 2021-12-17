#!/usr/bin/env node

import program from "commander";
import path from "path";
import fs from "fs-extra";
import weappPublish from "./src/publish.js";

const __dirname = path.resolve();

program.version(
  fs.readJSONSync(path.resolve(__dirname, "package.json")).version
);

program.action(async () => {
  await weappPublish();
});

program.parse(process.argv);
