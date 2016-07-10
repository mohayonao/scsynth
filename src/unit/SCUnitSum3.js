"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};
class SCUnitSum3 extends SCUnit {
  initialize(rate) {
    this._slopeFactor = rate.slopeFactor;
    if (this.calcRate === C.RATE_DEMAND) {
      this.dspProcess = dspProcess["d"];
    } else {
      this.dspProcess = dspProcess[$r2k(this.inputSpecs)] || null;
      this._in0 = this.inputs[0][0];
      this._in1 = this.inputs[1][0];
      this._in2 = this.inputs[2][0];
      if (this.dspProcess) {
        this.dspProcess(1);
      } else {
        this.outputs[0][0] = this._in0 + this._in1 + this._in2;
      }
    }
  }
}
function $r2k(inputSpecs) {
  return inputSpecs.map(x => x.rate === C.RATE_AUDIO ? "a" : x.rate === C.RATE_SCALAR ? "i" : "k").join("");
}
dspProcess["aaa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const inIn2 = this.inputs[2];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + inIn2[i];
  }
};
dspProcess["aak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const in2 = this._in2;
  const nextIn2 = this.inputs[2][0];
  const in2Slope = (nextIn2 - in2) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + (in2 + in2Slope * i);
  }
  this._in2 = nextIn2;
};
dspProcess["aai"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const in2 = this._in2;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + in2;
  }
};
dspProcess["akk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const in12 = this._in1 + this._in2;
  const nextIn12 = this.inputs[1][0] + this.inputs[2][0];
  const in12Slope = (nextIn12 - in12) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + (in12 + in12Slope * i);
  }
  this._in1 = this.inputs[1][0];
  this._in2 = this.inputs[2][0];
};
dspProcess["aki"] = dspProcess["akk"];
dspProcess["aii"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const in12 = this._in1 + this._in2;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + in12;
  }
};
dspProcess["kkk"] = function () {
  this.outputs[0][0] = this.inputs[0][0] + this.inputs[1][0] + this.inputs[2][0];
};
dspProcess["kki"] = dspProcess["kkk"];
dspProcess["kii"] = dspProcess["kkk"];
dspProcess["d"] = function (inNumSamples) {
  if (inNumSamples) {
    const a = demand.next(this, 0, inNumSamples);
    const b = demand.next(this, 1, inNumSamples);
    const c = demand.next(this, 2, inNumSamples);
    this.outputs[0][0] = isNaN(a) || isNaN(b) || isNaN(c) ? NaN : a + b + c;
  } else {
    demand.reset(this, 0);
    demand.reset(this, 1);
    demand.reset(this, 2);
  }
};
SCUnitRepository.registerSCUnitClass("Sum3", SCUnitSum3);
module.exports = SCUnitSum3;
