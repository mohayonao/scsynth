"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitLFTri extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["ki"];

    this._cpstoinc = 4 * rate.sampleDur;
    this._phase = this.inputs[1][0];

    this.dspProcess(1);
  }
}

dspProcess["ki"] = function(inNumSamples) {
  const out = this.outputs[0];
  const phase_slope = this.inputs[0][0] * this._cpstoinc;

  let phase = this._phase;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = 1 < phase ? 2 - phase : phase;
    phase += phase_slope;
    if (phase >= 3) {
      phase -= 4;
    }
  }

  this._phase = phase;
};

SCUnitRepository.registerSCUnitClass("LFTri", SCUnitLFTri);

module.exports = SCUnitLFTri;
