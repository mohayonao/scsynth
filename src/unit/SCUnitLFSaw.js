"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLFSaw extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._cpstoinc = 2 * rate.sampleDur;
    this._phase = this.inputs[1][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0] * this._cpstoinc;
  let phase = this._phase;
  if (freq >= 0) {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = phase;
      phase += freq;
      if (phase >= 1) {
        phase -= 2;
      }
    }
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = phase;
      phase += freq;
      if (phase <= -1) {
        phase += 2;
      }
    }
  }
  this._phase = phase;
};
SCUnitRepository.registerSCUnitClass("LFSaw", SCUnitLFSaw);
module.exports = SCUnitLFSaw;
