#!/usr/bin/env node

import program from "commander";
import path from "path";
import fs from "fs-extra";
import weappPublish from "./src/publish.js";
import getDirName from "./src/utils/getDirName.js";

const __dirname = getDirName(import.meta);

program.version(
  fs.readJSONSync(path.resolve(__dirname, "package.json")).version
);

program.action(async () => {
  await weappPublish();
});

program.parse(process.argv);
