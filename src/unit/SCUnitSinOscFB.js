"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sine = require("./_sine");
const gSineWavetable = sine.gSineWavetable;
const kSineSize = sine.kSineSize;
const kSineMask = sine.kSineMask;
const dspProcess = {};

class SCUnitSinOscFB extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["kk"];

    this._slopeFactor = rate.slopeFactor;
    this._radtoinc = kSineSize / (Math.PI * 2);
    this._cpstoinc = kSineSize * rate.sampleDur;
    this._freq = this.inputs[0][0];
    this._feedback = this.inputs[1][0] * this._radtoinc;
    this._x = 0;
    this._y = 0;

    this.dspProcess(1);
  }
}

dspProcess["kk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freq_next = this.inputs[0][0];
  const feedback_next = this.inputs[1][0];
  const freq = this._freq;
  const feedback = this._feedback;
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;

  let y = this._y;
  let x = this._x;

  if (freq === freq_next && feedback === feedback_next) {
    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + y * feedback * radtoinc;
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += freq * cpstoinc;
      y = out[i];
    }
  } else {
    const freq_slope = (freq_next - freq) * this._slopeFactor;
    const feedback_slope = (feedback_next - feedback) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + y * (feedback + feedback_slope * i) * radtoinc;
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += (freq + freq_slope * i) * cpstoinc;
      y = out[i];
    }

    this._freq = freq_next;
    this._feedback = feedback_next;
  }

  if (kSineSize <= x) {
    x -= kSineSize;
  }

  this._y = y;
  this._x = x;
};

SCUnitRepository.registerSCUnitClass("SinOscFB", SCUnitSinOscFB);

module.exports = SCUnitSinOscFB;
