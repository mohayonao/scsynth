"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitLFSaw extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["ki"];

    this._cpstoinc = 2 * rate.sampleDur;
    this._phase = this.inputs[1][0];

    this.dspProcess(1);
  }
}

dspProcess["ki"] = function(inNumSamples) {
  const out = this.outputs[0];
  const phase_slope = this.inputs[0][0] * this._cpstoinc;

  let phase = this._phase;

  if (0 <= phase_slope) {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = phase;
      phase += phase_slope;
      if (1 <= phase) {
        phase -= 2;
      }
    }
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = phase;
      phase += phase_slope;
      if (phase <= -1) {
        phase += 2;
      }
    }
  }

  this._phase = phase;
};

SCUnitRepository.registerSCUnitClass("LFSaw", SCUnitLFSaw);

module.exports = SCUnitLFSaw;
