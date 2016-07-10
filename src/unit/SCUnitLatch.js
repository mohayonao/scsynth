"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLatch extends SCUnit {
  initialize() {
    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_aa"];
    } else {
      this.dspProcess = dspProcess["next_ak"];
    }
    this._trig = 0;
    this._level = 0;
    this.outputs[0][0] = this.inputs[1][0] > 0 ? this.inputs[0][0] : 0;
  }
}
dspProcess["next_aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const trigIn = this.inputs[1];
  let trig = this._trig;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curTrig = trigIn[i];
    if (trig <= 0 && curTrig > 0) {
      level = inIn[i];
    }
    out[i] = level;
    trig = curTrig;
  }
  this._trig = trig;
  this._level = level;
};
dspProcess["next_ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trig = this.inputs[0][1];
  let level = this._level;
  if (this._trig <= 0 && trig > 0) {
    level = this.inputs[0][0];
  }
  out.fill(level, 0, inNumSamples);
  this._trig = trig;
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("Latch", SCUnitLatch);
module.exports = SCUnitLatch;
