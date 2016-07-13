"use strict";

const assert = require("assert");
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
      assert(
        this.inputSpecs[0].rate >= this.inputSpecs[1].rate &&
        this.inputSpecs[0].rate >= this.inputSpecs[2].rate
      );
      this.dspProcess = dspProcess[$r2k(this)];

      this._in = this.inputs[0][0];
      this._mul = this.inputs[1][0];
      this._add = this.inputs[2][0];

      this.outputs[0][0] = this._in * this._mul + this._add;
    }
  }
}

function $r2k(unit) {
  return unit.inputSpecs.map(({ rate }) => {
    if (rate === C.RATE_AUDIO) {
      return "a";
    }
    return rate === C.RATE_SCALAR ? "i" : "k";
  }).join("");
}

dspProcess["aaa"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mulIn = this.inputs[1];
  const addIn = this.inputs[2];

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mulIn[i] + addIn[i];
  }
};

dspProcess["aak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mulIn = this.inputs[1];
  const add = this._add;
  const next_add = this.inputs[2][0];
  const add_slope = (next_add - add) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mulIn[i] + (add + add_slope * i);
  }

  this._add = next_add;
};

dspProcess["aai"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mulIn = this.inputs[1];
  const add = this._add;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mulIn[i] + add;
  }
};

dspProcess["aka"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const addIn = this.inputs[2];
  const next_mul = this.inputs[1][0];
  const mul_slope = (next_mul - mul) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mul_slope * i) + addIn[i];
  }

  this._mul = next_mul;
};

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const next_mul = this.inputs[1][0];
  const mul_slope = (next_mul - mul) * this._slopeFactor;
  const next_add = this.inputs[2][0];
  const add_slope = (next_add - add) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mul_slope * i) + (add + add_slope * i);
  }

  this._mul = next_mul;
  this._add = next_add;
};

dspProcess["aki"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const next_mul = this.inputs[1][0];
  const mul_slope = (next_mul - mul) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mul_slope * i) + add;
  }

  this._mul = next_mul;
};

dspProcess["aia"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const addIn = this.inputs[2];

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mul + addIn[i];
  }
};

dspProcess["aik"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const next_add = this.inputs[2][0];
  const add_slope = (next_add - add) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * mul + (add + add_slope * i);
  }

  this._add = next_add;
};

dspProcess["aii"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mul = this._mul;
  const add = this._add;
  const next_mul = this.inputs[1][0];
  const mul_slope = (next_mul - mul) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (mul + mul_slope * i) + add;
  }

  this._mul = next_mul;
};

dspProcess["kkk"] = function() {
  this.outputs[0][0] = this.inputs[0][0] * this.inputs[1][0] + this.inputs[2][0];
};

dspProcess["kki"] = function() {
  this.outputs[0][0] = this.inputs[0][0] * this.inputs[1][0] + this._add;
};

dspProcess["kik"] = function() {
  this.outputs[0][0] = this.inputs[0][0] * this._mul + this.inputs[2][0];
};

dspProcess["kii"] = function() {
  this.outputs[0][0] = this.inputs[0][0] * this._mul + this._add;
};

dspProcess["d"] = function(inNumSamples) {
  if (inNumSamples) {
    const a = demand.next(this, 0, inNumSamples);
    const b = demand.next(this, 1, inNumSamples);
    const c = demand.next(this, 2, inNumSamples);

    this.outputs[0][0] = (isNaN(a) || isNaN(b) || isNaN(c)) ? NaN : a * b + c;
  } else {
    demand.reset(this, 0);
    demand.reset(this, 1);
    demand.reset(this, 2);
  }
};
SCUnitRepository.registerSCUnitClass("MulAdd", SCUnitMulAdd);
module.exports = SCUnitMulAdd;
