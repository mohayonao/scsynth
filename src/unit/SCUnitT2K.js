"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitT2K extends SCUnit {
  initialize() {
    assert(this.inputs.length === 1);
    this.dspProcess = dspProcess["a"];
    this.outputs[0][0] = this.inputs[0][0];
  }
}

dspProcess["a"] = function () {
  const inIn = this.inputs[0];

  let out = 0;

  for (let i = 0, imax = inIn.length; i < imax; i++) {
    out = Math.max(out, inIn[i]);
  }

  this.outputs[0][0] = out;
};

SCUnitRepository.registerSCUnitClass("T2K", SCUnitT2K);

module.exports = SCUnitT2K;
