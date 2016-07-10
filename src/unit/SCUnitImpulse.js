"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitImpulse extends SCUnit {
  initialize(rate) {
    this._phase = this.inputs[1][0];
    if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_a"];
      if (this.inputSpecs[1].rate !== C.RATE_SCALAR) {
        this._phase = 1;
      }
    } else {
      this.dspProcess = dspProcess["next_k"];
      if (this.inputSpecs[1].rate !== C.RATE_SCALAR) {
        this._phase = 1;
      }
    }
    this._slopeFactor = rate.slopeFactor;
    this._phaseOffset = 0;
    this._cpstoinc = rate.sampleDur;
    if (this._phase === 0) {
      this._phase = 1;
    }
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const cpstoinc = this._cpstoinc;
  const phaseOffset = this.inputs[1][0];
  const prevPhaseOffset = this._phaseOffset;
  const phase_slope = (phaseOffset - prevPhaseOffset) * this._slopeFactor;
  let phase = this._phase + prevPhaseOffset;
  for (let i = 0; i < inNumSamples; i++) {
    phase += phase_slope;
    if (phase >= 1) {
      phase -= 1;
      out[i] = 1;
    } else {
      out[i] = 0;
    }
    phase += freqIn[i] * cpstoinc;
  }
  this._phase = phase - phaseOffset;
  this._phaseOffset = phaseOffset;
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0] * this._cpstoinc;
  const phaseOffset = this.inputs[1][0];
  const prevPhaseOffset = this._phaseOffset;
  const phase_slope = (phaseOffset - prevPhaseOffset) * this._slopeFactor;
  let phase = this._phase + prevPhaseOffset;
  for (let i = 0; i < inNumSamples; i++) {
    phase += phase_slope;
    if (phase >= 1) {
      phase -= 1;
      out[i] = 1;
    } else {
      out[i] = 0;
    }
    phase += freq;
  }
  this._phase = phase - phaseOffset;
  this._phaseOffset = phaseOffset;
};
SCUnitRepository.registerSCUnitClass("Impulse", SCUnitImpulse);
module.exports = SCUnitImpulse;
