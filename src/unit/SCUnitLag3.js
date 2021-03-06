"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitLag3 extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[1].rate !== C.RATE_SCALAR) {
      this.dspProcess = dspProcess["next"];
    } else {
      if (this.bufferLength === 1) {
        this.dspProcess = dspProcess["next_1_i"];
      } else {
        this.dspProcess = dspProcess["next"];
      }
    }
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._lag = NaN;
    this._b1 = 0;
    this._y1a = this.inputs[0][0];
    this._y1b = this.inputs[0][0];
    this._y1c = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const lag = this.inputs[1][0];
  let y1a = this._y1a;
  let y1b = this._y1b;
  let y1c = this._y1c;
  let b1 = this._b1;
  if (lag === this._lag) {
    for (let i = 0; i < inNumSamples; i++) {
      const y0a = inIn[i];
      y1a = y0a + b1 * (y1a - y0a);
      y1b = y1a + b1 * (y1b - y1a);
      y1c = y1b + b1 * (y1c - y1b);
      out[i] = y1c;
    }
  } else {
    this._b1 = lag === 0 ? 0 : Math.exp(log001 / (lag * this._sampleRate));
    this._lag = lag;
    const b1_slope = (this._b1 - b1) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const y0a = inIn[i];
      b1 += b1_slope;
      y1a = y0a + b1 * (y1a - y0a);
      y1b = y1a + b1 * (y1b - y1a);
      y1c = y1b + b1 * (y1c - y1b);
      out[i] = y1c;
    }
  }
  this._y1a = y1a;
  this._y1b = y1b;
  this._y1c = y1c;
};
dspProcess["next_1_i"] = function () {
  const out = this.outputs[0];
  const y0a = this.inputs[0][0];
  const b1 = this._b1;
  let y1a = this._y1a;
  let y1b = this._y1b;
  let y1c = this._y1c;
  y1a = y0a + b1 * (y1a - y0a);
  y1b = y1a + b1 * (y1b - y1a);
  y1c = y1b + b1 * (y1c - y1b);
  out[0] = y1c;
  this._y1a = y1a;
  this._y1b = y1b;
  this._y1c = y1c;
};
SCUnitRepository.registerSCUnitClass("Lag3", SCUnitLag3);
module.exports = SCUnitLag3;
