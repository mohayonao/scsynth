"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitTrigImpulse extends SCUnit {
  initialize(rate) {
    this._phase = this.inputs[2][0];
    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_ka"];
      if (this.inputSpecs[2].rate !== C.RATE_SCALAR) {
        this._phase = 1;
      }
    } else {
      this.dspProcess = dspProcess["next_kk"];
      if (this.inputSpecs[2].rate !== C.RATE_SCALAR) {
        this._phase = 1;
      }
    }
    this._slopeFactor = rate.slopeFactor;
    this._phaseOffset = 0;
    this._cpstoinc = rate.sampleDur;
    if (this._phase === 0) {
      this._phase = 1;
    }
    this._prevTrig = this.inputs[0][0];
  }
}
dspProcess["next_ka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trig = this.inputs[0];
  const freqIn = this.inputs[1];
  const cpstoinc = this._cpstoinc;
  const prevTrig = this._prevTrig;
  const phaseOffset = this.inputs[2][0];
  const prevPhaseOffset = this._phaseOffset;
  const phase_slope = (phaseOffset - prevPhaseOffset) * this._slopeFactor;
  let phase = this._phase;
  if (trig > 0 && prevTrig <= 0) {
    phase = phaseOffset;
    if (this.inputSpecs[2].rate !== C.SCALAR) {
      phase = 1;
    }
    if (phase === 0) {
      phase = 1;
    }
  }
  phase += prevPhaseOffset;
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
  this._prevTrig = trig;
};
dspProcess["next_kk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trig = this.inputs[0][0];
  const freq = this.inputs[1][0] * this._cpstoinc;
  const prevTrig = this._prevTrig;
  const phaseOffset = this.inputs[2][0];
  const prevPhaseOffset = this._phaseOffset;
  const phase_slope = (phaseOffset - prevPhaseOffset) * this._slopeFactor;
  let phase = this._phase;
  if (trig > 0 && prevTrig <= 0) {
    phase = phaseOffset;
    if (this.inputSpecs[2].rate !== C.SCALAR) {
      phase = 1;
    }
    if (phase === 0) {
      phase = 1;
    }
  }
  phase += prevPhaseOffset;
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
  this._prevTrig = trig;
};
SCUnitRepository.registerSCUnitClass("TrigImpulse", SCUnitTrigImpulse);
module.exports = SCUnitTrigImpulse;
