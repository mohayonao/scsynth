"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLeakDC extends SCUnit {
  initialize(rate) {
    if (this.bufferLength === 1) {
      this.dspProcess = dspProcess["next_1"];
    } else {
      if (this.inputSpecs[1].rate === C.RATE_SCALAR) {
        this.dspProcess = dspProcess["next_i"];
      } else {
        this.dspProcess = dspProcess["next"];
      }
    }
    this._filterSlope = rate.filterSlope;
    this._b1 = 0;
    this._x1 = this.inputs[0][0];
    this._y1 = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const b1 = this._b1;
  const b1_next = this.inputs[1][0];
  let y1 = this._y1;
  let x1 = this._x1;
  if (b1 === b1_next) {
    for (let i = 0; i < inNumSamples; i++) {
      const x0 = inIn[i];
      out[i] = y1 = x0 - x1 + b1 * y1;
      x1 = x0;
    }
  } else {
    const b1_slope = (b1_next - b1) * this._filterSlope;
    for (let i = 0; i < inNumSamples; i) {
      const x0 = inIn[i];
      out[i] = y1 = x0 - x1 + (b1 + b1_slope * i) * y1;
      x1 = x0;
    }
    this._b1 = b1_next;
  }
  this._x1 = x1;
  this._y1 = y1;
};
dspProcess["next_i"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const b1 = this._b1;
  let y1 = this._y1;
  let x1 = this._x1;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = inIn[i];
    out[i] = y1 = x0 - x1 + b1 * y1;
    x1 = x0;
  }
  this._x1 = x1;
  this._y1 = y1;
};
dspProcess["next_1"] = function () {
  const x0 = this.inputs[0][0];
  const b1 = this.inputs[1][0];
  let y1 = this._y1;
  let x1 = this._x1;
  this.outputs[0][0] = y1 = x0 - x1 + b1 * y1;
  x1 = x0;
  this._x1 = x1;
  this._y1 = y1;
};
SCUnitRepository.registerSCUnitClass("LeakDC", SCUnitLeakDC);
module.exports = SCUnitLeakDC;
