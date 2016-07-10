"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitLag extends SCUnit {
  initialize(rate) {
    if (this.bufferLength === 1) {
      this.dspProcess = dspProcess["next_1"];
    } else {
      this.dspProcess = dspProcess["next"];
    }
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._lag = NaN;
    this._b1 = 0;
    this._y1 = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const lag = this.inputs[1][0];
  let y1 = this._y1;
  let b1 = this._b1;
  if (lag === this._lag) {
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i];
      out[i] = y1 = y0 + b1 * (y1 - y0);
    }
  } else {
    this._b1 = lag === 0 ? 0 : Math.exp(log001 / (lag * this._sampleRate));
    this._lag = lag;
    const b1_slope = (this._b1 - b1) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i];
      out[i] = y1 = y0 + (b1 + b1_slope * i) * (y1 - y0);
    }
  }
  this._y1 = y1;
};
dspProcess["next_1"] = function () {
  const out = this.outputs[0];
  const lag = this.inputs[1][0];
  let y1 = this._y1;
  let b1 = this._b1;
  if (lag !== this._lag) {
    this._b1 = b1 = lag === 0 ? 0 : Math.exp(log001 / (lag * this._sampleRate));
    this._lag = lag;
  }
  const y0 = this.inputs[0][0];
  out[0] = y1 = y0 + b1 * (y1 - y0);
  this._y1 = y1;
};
SCUnitRepository.registerSCUnitClass("Lag", SCUnitLag);
module.exports = SCUnitLag;
