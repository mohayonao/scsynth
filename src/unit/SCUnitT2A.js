"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");
const dspProcess = {};

class SCUnitT2A extends SCUnit {
  initialize() {
    assert(this.inputs.length === 2);
    this.dspProcess = dspProcess["ak"];

    this._level = 0;

    this.dspProcess(1);
  }
}

dspProcess["ak"] = function() {
  const out = this.outputs[0];
  const level = this.inputs[0][0];

  fill(out, 0);

  if (this._level <= 0 && 0 < level) {
    this.outputs[0][this.inputs[1][0]|0] = level;
  }

  this._level = level;
};

SCUnitRepository.registerSCUnitClass("T2A", SCUnitT2A);

module.exports = SCUnitT2A;
