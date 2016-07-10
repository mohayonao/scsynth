"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitSweep extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleDur = rate.sampleDur;
    this._prevtrig = this.inputs[0][0];
    this._level = 0;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const rate = this.inputs[1][0] * this._sampleDur;
  let prevtrig = this._prevtrig;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    if (prevtrig <= 0 && curtrig > 0) {
      const frac = -prevtrig / (curtrig - prevtrig);
      level = frac * rate;
    } else {
      level += rate;
    }
    out[i] = level;
    prevtrig = curtrig;
  }
  this._prevtrig = prevtrig;
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("Sweep", SCUnitSweep);
module.exports = SCUnitSweep;
