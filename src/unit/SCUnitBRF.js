"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitBRF extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["akk"];

    this._radiansPerSample = rate.radiansPerSample;
    this._slopeFactor = rate.slopeFactor;
    this._a0 = 0;
    this._a1 = 0;
    this._b2 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._freq = NaN;
    this._bw = NaN;

    this.dspProcess(1);
  }
}
dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq_next = this.inputs[1][0];
  const bw_next = this.inputs[2][0];
  const freq = this._freq;
  const bw = this._bw;
  const a0 = this._a0;
  const a1 = this._a1;
  const b2 = this._b2;

  let y1 = this._y1;
  let y2 = this._y2;

  if (freq === freq_next && bw === bw_next) {
    for (let i = 0; i < inNumSamples; i++) {
      const ay = a1 * y1;
      const y0 = inIn[i] - ay - b2 * y2;

      out[i] = a0 * (y0 + y2) + ay;

      y2 = y1;
      y1 = y0;
    }
  } else {
    const pfreq = freq_next * this._radiansPerSample;
    const pbw = bw_next * pfreq * 0.5;
    const c = Math.tan(pbw);
    const d = 2 * Math.cos(pfreq);
    const a0_next = 1 / (1 + c);
    const a1_next = -d * a0_next;
    const b2_next = (1 - c) * a0_next;
    const a0_slope = (a0_next - a0) * this._slopeFactor;
    const a1_slope = (a1_next - a1) * this._slopeFactor;
    const b2_slope = (b2_next - b2) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const ay = (a1 + a1_slope * i) * y1;
      const y0 = inIn[i] - ay - (b2 + b2_slope * i) * y2;

      out[i] = (a0 + a0_slope * i) * (y0 + y2) + ay;

      y2 = y1;
      y1 = y0;
    }

    this._freq = freq_next;
    this._bw = bw_next;
    this._a0 = a0_next;
    this._a1 = a1_next;
    this._b2 = b2_next;
  }

  this._y1 = y1;
  this._y2 = y2;
};

SCUnitRepository.registerSCUnitClass("BRF", SCUnitBRF);

module.exports = SCUnitBRF;
