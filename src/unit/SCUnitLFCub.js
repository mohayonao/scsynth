"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLFCub extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._cpstoinc = 2 * rate.sampleDur;
    this._phase = this.inputs[1][0] + 0.5;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0] * this._cpstoinc;
  let phase = this._phase;
  for (let i = 0; i < inNumSamples; i++) {
    let z;
    if (phase < 1) {
      z = phase;
    } else if (phase < 2) {
      z = 2 - phase;
    } else {
      phase -= 2;
      z = phase;
    }
    out[i] = z * z * (6 - 4 * z) - 1;
    phase += freq;
  }
  this._phase = phase;
};
SCUnitRepository.registerSCUnitClass("LFCub", SCUnitLFCub);
module.exports = SCUnitLFCub;
