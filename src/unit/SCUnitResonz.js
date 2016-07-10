"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitResonz extends SCUnit {
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
    this._rq = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq = this.inputs[1][0];
  const rq = this.inputs[2][0];
  const a0 = this._a0;
  const b1 = this._b1;
  const b2 = this._b2;
  let y1 = this._y1;
  let y2 = this._y2;
  if (freq !== this._freq || rq !== this._rq) {
    const ffreq = freq * this._radiansPerSample;
    const B = ffreq * rq;
    const R = 1 - B * 0.5;
    const twoR = 2 * R;
    const R2 = R * R;
    const cost = twoR * Math.cos(ffreq) / (1 + R2);
    const b1_next = twoR * cost;
    const b2_next = -R2;
    const a0_next = (1 - R2) * 0.5;
    const a0_slope = (a0_next - a0) * this._slopeFactor;
    const b1_slope = (b1_next - b1) * this._slopeFactor;
    const b2_slope = (b2_next - b2) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i] + (b1 + b1_slope * i) * y1 + (b2 + b2_slope * i) * y2;
      out[i] = (a0 + a0_slope * i) * (y0 - y2);
      y2 = y1;
      y1 = y0;
    }
    this._freq = freq;
    this._rq = rq;
    this._a0 = a0_next;
    this._b1 = b1_next;
    this._b2 = b2_next;
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
SCUnitRepository.registerSCUnitClass("Resonz", SCUnitResonz);
module.exports = SCUnitResonz;
