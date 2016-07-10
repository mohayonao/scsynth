"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitRingz extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._radiansPerSample = rate.radiansPerSample;
    this._slopeFactor = rate.slopeFactor;
    this._b1 = 0;
    this._b2 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._freq = NaN;
    this._decayTime = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq = this.inputs[1][0];
  const decayTime = this.inputs[2][0];
  const a0 = 0.5;
  const b1 = this._b1;
  const b2 = this._b2;
  let y1 = this._y1;
  let y2 = this._y2;
  if (freq !== this._freq || decayTime !== this._decayTime) {
    const ffreq = freq * this._radiansPerSample;
    const R = decayTime === 0 ? 0 : Math.exp(log001 / (decayTime * this._sampleRate));
    const twoR = 2 * R;
    const R2 = R * R;
    const cost = twoR * Math.cos(ffreq) / (1 + R2);
    const b1_next = twoR * cost;
    const b2_next = -R2;
    const b1_slope = (b1_next - b1) * this._slopeFactor;
    const b2_slope = (b2_next - b2) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i] + (b1 + b1_slope * i) * y1 + (b2 + b2_slope * i) * y2;
      out[i] = a0 * (y0 - y2);
      y2 = y1;
      y1 = y0;
    }
    this._freq = freq;
    this._decayTime = decayTime;
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
SCUnitRepository.registerSCUnitClass("Ringz", SCUnitRingz);
module.exports = SCUnitRingz;
