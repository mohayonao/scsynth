"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sine = require("./_sine");
const dspProcess = {};
const table = sine.gSineWavetable;
const mask = sine.kSineMask;
class SCUnitSinOsc extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess[$r2k(this.inputSpecs)] || null;
    this._slopeFactor = rate.slopeFactor;
    this._freq = this.inputs[0][0];
    this._phase = this.inputs[1][0];
    this._radtoinc = sine.kSineSize / (2 * Math.PI);
    this._cpstoinc = sine.kSineSize * (1 / rate.sampleRate);
    this._x = 0;
    if (this.dspProcess) {
      this.dspProcess(1);
    }
  }
}
function $r2k(inputSpecs) {
  return inputSpecs.map(x => x.rate === C.RATE_AUDIO ? "a" : x.rate === C.RATE_SCALAR ? "i" : "k").join("");
}
dspProcess["aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const phaseIn = this.inputs[1];
  const cpstoinc = this._cpstoinc;
  const radtoinc = this._radtoinc;
  let x = this._x;
  for (let i = 0; i < inNumSamples; i++) {
    const pphase = x + radtoinc * phaseIn[i];
    const index = (pphase & mask) << 1;
    out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
    x += freqIn[i] * cpstoinc;
  }
  this._x = x;
};
dspProcess["ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const nextPhase = this.inputs[1][0];
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;
  let phase = this._phase;
  let x = this._x;
  if (nextPhase === phase) {
    phase *= radtoinc;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + phase;
      const index = (pphase & mask) << 1;
      out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      x += freqIn[i] * cpstoinc;
    }
  } else {
    const phaseSlope = (nextPhase - phase) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + radtoinc * phase;
      const index = (pphase & mask) << 1;
      out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      phase += phaseSlope;
      x += freqIn[i] * cpstoinc;
    }
    this._phase = nextPhase;
  }
  this._x = x;
};
dspProcess["ai"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const phase = this._phase * this._radtoinc;
  const cpstoinc = this._cpstoinc;
  let x = this._x;
  for (let i = 0; i < inNumSamples; i++) {
    const pphase = x + phase;
    const index = (pphase & mask) << 1;
    out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
    x += cpstoinc * freqIn[i];
  }
  this._x = x;
};
dspProcess["ka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const nextFreq = this.inputs[0][0];
  const phaseIn = this.inputs[1];
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;
  let freq = this._freq;
  let x = this._x;
  if (nextFreq === freq) {
    freq *= cpstoinc;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + radtoinc * phaseIn[i];
      const index = (pphase & mask) << 1;
      out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      x += freq;
    }
  } else {
    const freqSlope = (nextFreq - freq) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + radtoinc * phaseIn[i];
      const index = (pphase & mask) << 1;
      out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      x += freq * cpstoinc;
      freq += freqSlope;
    }
    this._freq = nextFreq;
  }
  this._x = x;
};
dspProcess["kk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const nextFreq = this.inputs[0][0];
  const nextPhase = this.inputs[1][0];
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;
  let freq = this._freq;
  let phase = this._phase;
  let x = this._x;
  if (nextFreq === freq && nextPhase === phase) {
    freq *= cpstoinc;
    phase *= radtoinc;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + phase;
      const index = (pphase & mask) << 1;
      out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      x += freq;
    }
  } else {
    const freqSlope = (nextFreq - freq) * this._slopeFactor;
    const phaseSlope = (nextPhase - phase) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + radtoinc * phase;
      const index = (pphase & mask) << 1;
      out[i] = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      x += freq * cpstoinc;
      freq += freqSlope;
      phase += phaseSlope;
    }
    this._freq = nextFreq;
    this._phase = nextPhase;
  }
  this._x = x;
};
dspProcess["ki"] = dspProcess["kk"];
dspProcess["ia"] = dspProcess["kk"];
dspProcess["ik"] = dspProcess["kk"];
dspProcess["ii"] = dspProcess["kk"];
SCUnitRepository.registerSCUnitClass("SinOsc", SCUnitSinOsc);
module.exports = SCUnitSinOsc;
