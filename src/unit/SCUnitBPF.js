"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitBPF extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._radiansPerSample = rate.radiansPerSample;
    this._slopeFactor = rate.slopeFactor;
    this._a0 = 0;
    this._b1 = 0;
    this._b2 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._freq = NaN;
    this._bw = NaN;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq = this.inputs[1][0];
  const bw = this.inputs[2][0];
  const a0 = this._a0;
  const b1 = this._b1;
  const b2 = this._b2;
  let y1 = this._y1;
  let y2 = this._y2;
  if (freq !== this._freq || bw !== this._bw) {
    const pfreq = freq * this._radiansPerSample;
    const pbw = bw * pfreq * 0.5;
    const C = pbw ? 1 / Math.tan(pbw) : 0;
    const D = 2 * Math.cos(pfreq);
    const next_a0 = 1 / (1 + C);
    const next_b1 = C * D * next_a0;
    const next_b2 = (1 - C) * next_a0;
    const a0_slope = (next_a0 - a0) * this._slopeFactor;
    const b1_slope = (next_b1 - b1) * this._slopeFactor;
    const b2_slope = (next_b2 - b2) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i] + (b1 + b1_slope * i) * y1 + (b2 + b2_slope * i) * y2;
      out[i] = (a0 + a0_slope * i) * (y0 - y2);
      y2 = y1;
      y1 = y0;
    }
    this._freq = freq;
    this._bw = bw;
    this._a0 = next_a0;
    this._b1 = next_b1;
    this._b2 = next_b2;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i] + b1 * y1 + b2 * y2;
      out[i] = a0 * (y0 - y2);
      y2 = y1;
      y1 = y0;
    }
  }
  this._y1 = y1;
  this._y2 = y2;
};
SCUnitRepository.registerSCUnitClass("BPF", SCUnitBPF);
module.exports = SCUnitBPF;
