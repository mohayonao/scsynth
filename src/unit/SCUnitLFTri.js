"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLFTri extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._cpstoinc = 4 * rate.sampleDur;
    this._phase = this.inputs[1][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0] * this._cpstoinc;
  let phase = this._phase;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = phase > 1 ? 2 - phase : phase;
    phase += freq;
    if (phase >= 3) {
      phase -= 4;
    }
  }
  this._phase = phase;
};
SCUnitRepository.registerSCUnitClass("LFTri", SCUnitLFTri);
module.exports = SCUnitLFTri;
