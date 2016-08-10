"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitRLPF extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["akk"];

    this._radiansPerSample = rate.radiansPerSample;
    this._slopeFactor = rate.slopeFactor;
    this._a0 = 0;
    this._b1 = 0;
    this._b2 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._freq = NaN;
    this._reson = NaN;

    this.dspProcess(1);
  }
}

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq_next = this.inputs[1][0];
  const reson_next = Math.max(0.001, this.inputs[2][0]);
  const freq = this._freq;
  const reson = this._reson;
  const a0 = this._a0;
  const b1 = this._b1;
  const b2 = this._b2;

  let y1 = this._y1;
  let y2 = this._y2;

  if (freq === freq_next && reson === reson_next) {
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = a0 * inIn[i] + b1 * y1 + b2 * y2;

      out[i] = y0 + 2 * y1 + y2;

      y2 = y1;
      y1 = y0;
    }
  } else {
    const pfreq = freq_next * this._radiansPerSample;
    const d = Math.tan(pfreq * reson_next * 0.5);
    const c = (1 - d) / (1 + d);
    const cosf = Math.cos(pfreq);
    const b1_next = (1 + c) * cosf;
    const b2_next = -c;
    const a0_next = (1 + c - b1_next) * 0.25;
    const a0_slope = (a0_next - a0) * this._slopeFactor;
    const b1_slope = (b1_next - b1) * this._slopeFactor;
    const b2_slope = (b2_next - b2) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const y0 = (a0 + a0_slope * i) * inIn[i] + (b1 + b1_slope * i) * y1 + (b2 + b2_slope * i) * y2;

      out[i] = y0 + 2 * y1 + y2;

      y2 = y1;
      y1 = y0;
    }

    this._freq = freq_next;
    this._reson = reson_next;
    this._a0 = a0_next;
    this._b1 = b1_next;
    this._b2 = b2_next;
  }

  this._y1 = y1;
  this._y2 = y2;
};

SCUnitRepository.registerSCUnitClass("RLPF", SCUnitRLPF);

module.exports = SCUnitRLPF;
