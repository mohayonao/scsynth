"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};
class SCUnitMulAdd extends SCUnit {
  initialize(rate) {
    this._slopeFactor = rate.slopeFactor;
    if (this.calcRate === C.RATE_DEMAND) {
      this.dspProcess = dspProcess["d"];
    } else {
      this.dspProcess = dspProcess[$r2k(this.inputSpecs)];
      this._in = this.inputs[0][0];
      this._mul = this.inputs[1][0];
      this._add = this.inputs[2][0];
      if (this.dspProcess) {
        this.dspProcess(1);
      } else {
        this.outputs[0][0] = this._in * this._mul + this._add;
      }
    }
  }
}
function $r2k(inputSpecs) {
  return inputSpecs.map(x => x.rate === C.RATE_AUDIO ? "a" : x.rate === C.RATE_SCALAR ? "i" : "k").join("");
}
dspProcess["aaa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mulIn = this.inputs[1];
  const addIn = this.inputs[2];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mulIn[i] + addIn[i];
  }
};
dspProcess["aak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mulIn = this.inputs[1];
  const add = this._add;
  const nextAdd = this.inputs[2][0];
  const addSlope = (nextAdd - add) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mulIn[i] + (add + addSlope * i);
  }
  this._add = nextAdd;
};
dspProcess["aai"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mulIn = this.inputs[1];
  const add = this._add;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mulIn[i] + add;
  }
};
dspProcess["aka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const addIn = this.inputs[2];
  const nextMul = this.inputs[1][0];
  const mulSlope = (nextMul - mul) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mulSlope * i) + addIn[i];
  }
  this._mul = nextMul;
};
dspProcess["akk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const nextMul = this.inputs[1][0];
  const mulSlope = (nextMul - mul) * this._slopeFactor;
  const nextAdd = this.inputs[2][0];
  const addSlope = (nextAdd - add) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mulSlope * i) + (add + addSlope * i);
  }
  this._mul = nextMul;
  this._add = nextAdd;
};
dspProcess["aki"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const nextMul = this.inputs[1][0];
  const mulSlope = (nextMul - mul) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mulSlope * i) + add;
  }
  this._mul = nextMul;
};
dspProcess["aia"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const addIn = this.inputs[2];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mul + addIn[i];
  }
};
dspProcess["aik"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const nextAdd = this.inputs[2][0];
  const addSlope = (nextAdd - add) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mul + (add + addSlope * i);
  }
  this._add = nextAdd;
};
dspProcess["aii"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const nextMul = this.inputs[1][0];
  const mulSlope = (nextMul - mul) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mulSlope * i) + add;
  }
  this._mul = nextMul;
};
dspProcess["kka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const _in = this._in;
  const mul = this._mul;
  const addIn = this.inputs[2];
  const nextIn = this.inputs[0][0];
  const inSlope = (nextIn - _in) * this._slopeFactor;
  const nextMul = this.inputs[1][0];
  const mulSlope = (nextMul - mul) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = (_in + inSlope * i) * (mul + mulSlope * i) + addIn[i];
  }
  this._in = nextIn;
  this._mul = nextMul;
};
dspProcess["kkk"] = function () {
  this.outputs[0][0] = this.inputs[0][0] * this.inputs[1][0] + this.inputs[2][0];
};
dspProcess["kki"] = function () {
  this.outputs[0][0] = this.inputs[0][0] * this.inputs[1][0] + this._add;
};
dspProcess["kia"] = function (inNumSamples) {
  const out = this.outputs[0];
  const _in = this._in;
  const mul = this._mul;
  const addIn = this.inputs[2];
  const nextIn = this.inputs[0][0];
  const inSlope = (nextIn - _in) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = (_in + inSlope * i) * mul + addIn[i];
  }
  this._in = nextIn;
};
dspProcess["kik"] = function () {
  this.outputs[0][0] = this.inputs[0][0] * this._mul + this.inputs[2][0];
};
dspProcess["kii"] = function () {
  this.outputs[0][0] = this.inputs[0][0] * this._mul + this._add;
};
dspProcess["d"] = function (inNumSamples) {
  if (inNumSamples) {
    const a = demand.next(this, 0, inNumSamples);
    const b = demand.next(this, 1, inNumSamples);
    const c = demand.next(this, 2, inNumSamples);
    this.outputs[0][0] = isNaN(a) || isNaN(b) || isNaN(c) ? NaN : a * b + c;
  } else {
    demand.reset(this, 0);
    demand.reset(this, 1);
    demand.reset(this, 2);
  }
};
SCUnitRepository.registerSCUnitClass("MulAdd", SCUnitMulAdd);
module.exports = SCUnitMulAdd;
