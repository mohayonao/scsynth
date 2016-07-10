"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitTIRand extends SCUnit {
  initialize() {
    if (this.calcRate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_a"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    const lo = this.inputs[0][0] | 0;
    const hi = this.inputs[1][0] | 0;
    this.outputs[0][0] = this._value = Math.random() * (hi - lo) + lo | 0;
    this._trig = this.inputs[2][0];
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[2];
  let value = this._value;
  let prev = this._trig;
  let next;
  for (let i = 0; i < inNumSamples; i++) {
    next = trigIn[i];
    if (next > 0 && prev <= 0) {
      const lo = this.inputs[0][0] | 0;
      const hi = this.inputs[1][0] | 0;
      out[i] = value = Math.random() * (hi - lo) + lo | 0;
    } else {
      out[i] = value;
    }
    prev = next;
  }
  this._trig = next;
  this._value = value;
};
dspProcess["next_k"] = function () {
  const out = this.outputs[0];
  const trig = this.inputs[2][0];
  if (trig > 0 && this._trig <= 0) {
    const lo = this.inputs[0][0] | 0;
    const hi = this.inputs[1][0] | 0;
    out[0] = this._value = Math.random() * (hi - lo) + lo | 0;
  } else {
    out[0] = this._value;
  }
  this._trig = trig;
};
SCUnitRepository.registerSCUnitClass("TIRand", SCUnitTIRand);
module.exports = SCUnitTIRand;
