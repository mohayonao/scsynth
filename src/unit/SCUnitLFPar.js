"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLFPar extends SCUnit {
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
  let z, y;
  for (let i = 0; i < inNumSamples; i++) {
    if (phase < 1) {
      z = phase;
      y = 1 - z * z;
    } else if (phase < 3) {
      z = phase - 2;
      y = z * z - 1;
    } else {
      phase -= 4;
      z = phase;
      y = 1 - z * z;
    }
    out[i] = y;
    phase += freq;
  }
  this._phase = phase;
};
SCUnitRepository.registerSCUnitClass("LFPar", SCUnitLFPar);
module.exports = SCUnitLFPar;
