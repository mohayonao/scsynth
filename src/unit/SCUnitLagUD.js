"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitLagUD extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._lagu = NaN;
    this._lagd = NaN;
    this._b1u = 0;
    this._b1d = 0;
    this._y1 = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const lagu = this.inputs[1][0];
  const lagd = this.inputs[2][0];
  const b1u = this._b1u;
  const b1d = this._b1d;
  let y1 = this._y1;
  if (lagu === this._lagu && lagd === this._lagd) {
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i];
      if (y0 > y1) {
        out[i] = y1 = y0 + b1u * (y1 - y0);
      } else {
        out[i] = y1 = y0 + b1d * (y1 - y0);
      }
    }
  } else {
    this._b1u = lagu === 0 ? 0 : Math.exp(log001 / (lagu * this._sampleRate));
    this._b1d = lagd === 0 ? 0 : Math.exp(log001 / (lagd * this._sampleRate));
    this._lagu = lagu;
    this._lagd = lagd;
    const b1u_slope = (this._b1u - b1u) * this._slopeFactor;
    const b1d_slope = (this._b1d - b1d) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const y0 = inIn[i];
      if (y0 > y1) {
        out[i] = y1 = y0 + (b1u + b1u_slope * i) * (y1 - y0);
      } else {
        out[i] = y1 = y0 + (b1d + b1d_slope * i) * (y1 - y0);
      }
    }
  }
  this._y1 = y1;
};
SCUnitRepository.registerSCUnitClass("LagUD", SCUnitLagUD);
module.exports = SCUnitLagUD;
