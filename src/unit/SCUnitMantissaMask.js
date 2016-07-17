"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

const f32 = new Float32Array(1);
const i32 = new Int32Array(f32.buffer);
const dspProcess = {};

class SCUnitMantissaMask extends SCUnit {
  initialize() {
    assert(this.inputs.length === 2);
    this.dspProcess = dspProcess["ak"];
    this.dspProcess(1);
  }
}

dspProcess["ak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const bits = this.inputs[0][1]|0;
  const mask = -1 << (23 - bits);

  for (let i = 0; i < inNumSamples; i++)  {
    f32[0] = inIn[i];
    i32[0] = mask & i32[0];
    out[i] = f32[0];
  }
};

SCUnitRepository.registerSCUnitClass("MantissaMask", SCUnitMantissaMask);

module.exports = SCUnitMantissaMask;
