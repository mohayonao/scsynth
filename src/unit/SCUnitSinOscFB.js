"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sine = require("./_sine");
const dspProcess = {};
const gSineWavetable = sine.gSineWavetable;
const kSineSize = sine.kSineSize;
const kSineMask = sine.kSineMask;
class SCUnitSinOscFB extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._slopeFactor = rate.slopeFactor;
    this._radtoinc = kSineSize / (Math.PI * 2);
    this._cpstoinc = kSineSize * rate.sampleDur;
    this._mask = kSineMask;
    this._table = gSineWavetable;
    this._freq = this.inputs[0][0];
    this._feedback = this.inputs[1][0] * this._radtoinc;
    this._y = 0;
    this._x = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const nextFreq = this.inputs[0][0];
  const nextFeedback = this.inputs[1][0];
  const mask = this._mask;
  const table = this._table;
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;
  let freq = this._freq;
  let feedback = this._feedback;
  let y = this._y;
  let x = this._x;
  if (nextFreq === freq && nextFeedback === feedback) {
    freq *= cpstoinc;
    feedback *= radtoinc;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + feedback * y;
      const index = (pphase & mask) << 1;
      out[i] = y = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      x += freq;
    }
  } else {
    const freq_slope = (nextFreq - freq) * this._slopeFactor;
    const feedback_slope = (nextFeedback - feedback) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const pphase = x + radtoinc * (feedback + feedback_slope * i) * y;
      const index = (pphase & mask) << 1;
      out[i] = y = table[index] + (pphase - (pphase | 0)) * table[index + 1];
      x += (freq + freq_slope * i) * cpstoinc;
    }
    this._freq = nextFreq;
    this._feedback = nextFeedback;
  }
  this._y = y;
  this._x = x;
};
SCUnitRepository.registerSCUnitClass("SinOscFB", SCUnitSinOscFB);
module.exports = SCUnitSinOscFB;
