"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitOneZero extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._slopeFactor = rate.slopeFactor;
    this._b1 = this.inputs[1][0];
    this._x1 = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const b1 = this._b1;
  const next_b1 = Math.max(-1, Math.min(this.inputs[1][0], 1));
  let x1 = this._x1;
  if (b1 !== next_b1) {
    let b1_slope = (next_b1 - b1) * this._slopeFactor;
    if (b1 >= 0 && next_b1 >= 0) {
      for (let i = 0; i < inNumSamples; i++) {
        const x0 = inIn[i];
        out[i] = x0 + (b1 + b1_slope * i) * (x1 - x0);
        x1 = x0;
      }
    } else if (b1 <= 0 && next_b1 <= 0) {
      for (let i = 0; i < inNumSamples; i++) {
        const x0 = inIn[i];
        out[i] = x0 + (b1 + b1_slope * i) * (x1 + x0);
        x1 = x0;
      }
    } else {
      for (let i = 0; i < inNumSamples; i++) {
        const x0 = inIn[i];
        out[i] = (1 - Math.abs(b1 + b1_slope * i)) * x0 + b1 * x1;
        x1 = x0;
      }
    }
    this._b1 = next_b1;
  } else {
    if (b1 >= 0) {
      for (let i = 0; i < inNumSamples; i++) {
        const x0 = inIn[i];
        out[i] = x0 + b1 * (x1 - x0);
        x1 = x0;
      }
    } else {
      for (let i = 0; i < inNumSamples; i++) {
        const x0 = inIn[i];
        out[i] = x0 + b1 * (x1 + x0);
        x1 = x0;
      }
    }
  }
  this._x1 = x1;
};
SCUnitRepository.registerSCUnitClass("OneZero", SCUnitOneZero);
module.exports = SCUnitOneZero;
