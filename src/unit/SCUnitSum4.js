"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};
class SCUnitSum4 extends SCUnit {
  initialize(rate) {
    this._slopeFactor = rate.slopeFactor;
    if (this.calcRate === C.RATE_DEMAND) {
      this.dspProcess = dspProcess["d"];
    } else {
      this.dspProcess = dspProcess[$r2k(this.inputSpecs)] || null;
      this._in0 = this.inputs[0][0];
      this._in1 = this.inputs[1][0];
      this._in2 = this.inputs[2][0];
      this._in3 = this.inputs[3][0];
      if (this.dspProcess) {
        this.dspProcess(1);
      } else {
        this.outputs[0][0] = this._in0 + this._in1 + this._in2 + this._in3;
      }
    }
  }
}
function $r2k(inputSpecs) {
  return inputSpecs.map(x => x.rate === C.RATE_AUDIO ? "a" : x.rate === C.RATE_SCALAR ? "i" : "k").join("");
}
dspProcess["aaaa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const inIn2 = this.inputs[2];
  const inIn3 = this.inputs[3];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + inIn2[i] + inIn3[i];
  }
};
dspProcess["aaak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const inIn2 = this.inputs[2];
  const in3 = this._in3;
  const nextIn3 = this.inputs[3][0];
  const in3Slope = (nextIn3 - in3) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + inIn2[i] + (in3 + in3Slope * i);
  }
  this._in3 = nextIn3;
};
dspProcess["aaai"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const inIn2 = this.inputs[2];
  const in3 = this._in3;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + inIn2[i] + in3;
  }
};
dspProcess["aakk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const in23 = this._in2 + this._in3;
  const nextIn23 = this.inputs[2][0] + this.inputs[3][0];
  const in23Slope = (nextIn23 - in23) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + (in23 + in23Slope * i);
  }
  this._in2 = this.inputs[2][0];
  this._in3 = this.inputs[2][0];
};
dspProcess["aaki"] = dspProcess["aakk"];
dspProcess["aaii"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const in23 = this._in2 + this._in3;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + in23;
  }
};
dspProcess["akkk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const in123 = this._in1 + this._in2 + this._in3;
  const nextIn123 = this.inputs[1][0] + this.inputs[2][0] + this.inputs[3][0];
  const in123Slope = (nextIn123 - in123) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + (in123 + in123Slope * i);
  }
  this._in1 = this.inputs[1][0];
  this._in2 = this.inputs[2][0];
  this._in3 = this.inputs[3][0];
};
dspProcess["akki"] = dspProcess["akkk"];
dspProcess["akii"] = dspProcess["akkk"];
dspProcess["aiii"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const in123 = this._in1 + this._in2 + this._in3;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + in123;
  }
};
dspProcess["kkkk"] = function () {
  this.outputs[0][0] = this.inputs[0][0] + this.inputs[1][0] + this.inputs[2][0] + this.inputs[3][0];
};
dspProcess["kkki"] = dspProcess["kkkk"];
dspProcess["kkii"] = dspProcess["kkkk"];
dspProcess["kiii"] = dspProcess["kkkk"];
dspProcess["d"] = function (inNumSamples) {
  if (inNumSamples) {
    const a = demand.next(this, 0, inNumSamples);
    const b = demand.next(this, 1, inNumSamples);
    const c = demand.next(this, 2, inNumSamples);
    const d = demand.next(this, 3, inNumSamples);
    this.outputs[0][0] = isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) ? NaN : a + b + c + d;
  } else {
    demand.reset(this, 0);
    demand.reset(this, 1);
    demand.reset(this, 2);
    demand.reset(this, 3);
  }
};
SCUnitRepository.registerSCUnitClass("Sum4", SCUnitSum4);
module.exports = SCUnitSum4;
