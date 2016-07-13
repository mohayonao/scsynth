"use strict";

const assert = require("assert");
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
      assert(
        this.calcRate === this.inputSpecs[0].rate
      );
      assert(
        this.inputSpecs.slice(1).every(
          (spec, prev, list) => spec.rate <= list[prev].rate
        )
      );
      this.dspProcess = dspProcess[$r2k(this)];

      this._in0 = this.inputs[0][0];
      this._in1 = this.inputs[1][0];
      this._in2 = this.inputs[2][0];

      this.outputs[0][0] = this._in0 + this._in1 + this._in2;
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
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const inIn2 = this.inputs[2];

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + inIn2[i];
  }
};

dspProcess["aak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const in2 = this._in2;
  const next_in2 = this.inputs[2][0];
  const in2_slope = (next_in2 - in2) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + (in2 + in2_slope * i);
  }

  this._in2 = next_in2;
};

dspProcess["aai"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const inIn1 = this.inputs[1];
  const in2 = this._in2;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + inIn1[i] + in2;
  }
};

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const in12 = this._in1 + this._in2;
  const next_in12 = this.inputs[1][0] + this.inputs[2][0];
  const in12_slope = (next_in12 - in12) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + (in12 + in12_slope * i);
  }

  this._in1 = this.inputs[1][0];
  this._in2 = this.inputs[2][0];
};

dspProcess["aki"] = dspProcess["akk"];

dspProcess["aii"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn0 = this.inputs[0];
  const in12 = this._in1 + this._in2;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn0[i] + in12;
  }
};

dspProcess["kkk"] = function() {
  this.outputs[0][0] = this.inputs[0][0] + this.inputs[1][0] + this.inputs[2][0];
};

dspProcess["kki"] = dspProcess["kkk"];

dspProcess["kii"] = dspProcess["kkk"];

dspProcess["d"] = function(inNumSamples) {
  if (inNumSamples) {
    const a = demand.next(this, 0, inNumSamples);
    const b = demand.next(this, 1, inNumSamples);
    const c = demand.next(this, 2, inNumSamples);

    this.outputs[0][0] = (isNaN(a) || isNaN(b) || isNaN(c)) ? NaN : a + b + c;
  } else {
    demand.reset(this, 0);
    demand.reset(this, 1);
    demand.reset(this, 2);
  }
};

SCUnitRepository.registerSCUnitClass("Sum3", SCUnitSum3);

module.exports = SCUnitSum3;
