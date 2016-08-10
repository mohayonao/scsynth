"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const sqrt2 = Math.sqrt(2);

class SCUnitLPF extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["ak"];

    this._radiansPerSample = rate.radiansPerSample;
    this._slopeFactor = rate.slopeFactor;
    this._a0 = 0;
    this._b1 = 0;
    this._b2 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._freq = NaN;

    this.dspProcess(1);
  }
}

dspProcess["ak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq_next = this.inputs[1][0];
  const freq = this._freq;
  const a0 = this._a0;
  const b1 = this._b1;
  const b2 = this._b2;

  let y1 = this._y1;
  let y2 = this._y2;

  if (freq === freq_next) {
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i] + b1 * y1 + b2 * y2;

      out[i] = a0 * (y0 + 2 * y1 + y2);

      y2 = y1;
      y1 = y0;
    }
  } else {
    const pfreq = freq_next * this._radiansPerSample * 0.5;
    const c = 1 / Math.tan(pfreq);
    const c2 = c * c;
    const sqrt2c = c * sqrt2;
    const a0_next = 1 / (1 + sqrt2c + c2);
    const b1_next = -2 * (1 - c2) * a0_next;
    const b2_next = -(1 - sqrt2c + c2) * a0_next;
    const a0_slope = (a0_next - a0) * this._slopeFactor;
    const b1_slope = (b1_next - b1) * this._slopeFactor;
    const b2_slope = (b2_next - b2) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i] + (b1 + b1_slope * i) * y1 + (b2 + b2_slope * i) * y2;

      out[i] = (a0 + a0_slope * i) * (y0 + 2 * y1 + y2);

      y2 = y1;
      y1 = y0;
    }

    this._freq = freq;
    this._a0 = a0_next;
    this._b1 = b1_next;
    this._b2 = b2_next;
  }

  this._y1 = y1;
  this._y2 = y2;
};

SCUnitRepository.registerSCUnitClass("LPF", SCUnitLPF);

module.exports = SCUnitLPF;
