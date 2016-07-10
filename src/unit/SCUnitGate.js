"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitGate extends SCUnit {
  initialize() {
    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_aa"];
    } else {
      this.dspProcess = dspProcess["next_ak"];
    }
    this._level = 0;
    this.outputs[0][0] = 0;
  }
}
dspProcess["next_aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const trigIn = this.inputs[1];
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curTrig = trigIn[i];
    if (curTrig > 0) {
      level = inIn[i];
    }
    out[i] = level;
  }
  this._level = level;
};
dspProcess["next_ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const trig = this.inputs[1][0];
  if (trig > 0) {
    out.set(inIn.subarray(0, inNumSamples));
    this._level = inIn[inNumSamples - 1];
  } else {
    out.fill(this._level, 0, inNumSamples);
  }
};
SCUnitRepository.registerSCUnitClass("Gate", SCUnitGate);
module.exports = SCUnitGate;
