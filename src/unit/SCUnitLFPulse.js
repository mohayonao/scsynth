"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitLFPulse extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["kik"];
    this._cpstoinc = rate.sampleDur;
    this._phase = this.inputs[1][0];
    this._duty = this.inputs[2][0];
    this.dspProcess(1);
  }
}

dspProcess["kik"] = function(inNumSamples) {
  const out = this.outputs[0];
  const phase_slope = this.inputs[0][0] * this._cpstoinc;
  const next_duty = this.inputs[2][0];

  let duty = this._duty;
  let phase = this._phase;
  let z;

  for (let i = 0; i < inNumSamples; i++) {
    if (phase > 1) {
      phase -= 1;
      duty = next_duty;
      z = duty < 0.5 ? 1 : 0;
    } else {
      z = phase < duty ? 1 : 0;
    }

    out[i] = z;
    phase += phase_slope;
  }

  this._duty = duty;
  this._phase = phase;
};

SCUnitRepository.registerSCUnitClass("LFPulse", SCUnitLFPulse);

module.exports = SCUnitLFPulse;
