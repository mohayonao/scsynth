"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitLag2UD extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._lagu = 0;
    this._lagd = 0;
    this._b1u = 0;
    this._b1d = 0;
    this._y1a = this.inputs[0][0];
    this._y1b = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const lagu = this.inputs[1][0];
  const lagd = this.inputs[2][0];
  let y1a = this._y1a;
  let y1b = this._y1b;
  let b1u = this._b1u;
  let b1d = this._b1d;
  if (lagu === this._lagu && lagd === this._lagd) {
    for (let i = 0; i < inNumSamples; i++) {
      const y0a = inIn[i];
      if (y0a > y1a) {
        y1a = y0a + b1u * (y1a - y0a);
      } else {
        y1a = y0a + b1d * (y1a - y0a);
      }
      if (y1a > y1b) {
        y1b = y1a + b1u * (y1b - y1a);
      } else {
        y1b = y1a + b1d * (y1b - y1a);
      }
      out[i] = y1b;
    }
  } else {
    this._b1u = lagu === 0 ? 0 : Math.exp(log001 / (lagu * this._sampleRate));
    this._b1d = lagd === 0 ? 0 : Math.exp(log001 / (lagd * this._sampleRate));
    this._lagu = lagu;
    this._lagd = lagd;
    const b1u_slope = (this._b1u - b1u) * this._slopeFactor;
    const b1d_slope = (this._b1d - b1d) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const y0a = inIn[i];
      b1u += b1u_slope;
      b1d += b1d_slope;
      if (y0a > y1a) {
        y1a = y0a + b1u * (y1a - y0a);
      } else {
        y1a = y0a + b1d * (y1a - y0a);
      }
      if (y1a > y1b) {
        y1b = y1a + b1u * (y1b - y1a);
      } else {
        y1b = y1a + b1d * (y1b - y1a);
      }
      out[i] = y1b;
    }
  }
  this._y1a = y1a;
  this._y1b = y1b;
};
SCUnitRepository.registerSCUnitClass("Lag2UD", SCUnitLag2UD);
module.exports = SCUnitLag2UD;
