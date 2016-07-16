"use strict";

const assert = require("assert");
const path = require("path");
const fs = require("fs");
const unitClassIndices = require("../../src/unit");

const unitClasses = fs.readdirSync(path.join(__dirname, "../../src/unit"))
  .filter(filename => /^SCUnit\w+\.js$/.test(filename))
  .map(filename => filename.replace(/\.js$/, ""));

unitClasses.forEach((unitClass) => {
  const exportedClass = unitClassIndices[unitClass];
  const requiredClass = require(path.join(__dirname, "../../src/unit", unitClass));

  assert(exportedClass === requiredClass, `${ unitClass } is not exported`);
});
