"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");

const dspProcess = {};

class SCUnitLastValue extends SCUnit {
  initialize() {
    assert(this.inputs.length === 2);

    if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["ak"];
    } else {
      this.dspProcess = dspProcess["kk"];
    }

    this._prev = this.inputs[0][0];
    this._curr = this.inputs[0][0];
  }
}

dspProcess["ak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const delta = this.inputs[1][0];

  let prev = this._prev;
  let curr = this._curr;

  for (let i = 0; i < inNumSamples; i++) {
    const inval = inIn[i];
    const diff = Math.abs(inval - curr);

    if (delta <= diff) {
      prev = curr;
      curr = inval;
    }
    out[i] = prev;
  }

  this._prev = prev;
  this._curr = curr;
};

dspProcess["kk"] = function() {
  const out = this.outputs[0];
  const inval = this.inputs[0][0];
  const delta = this.inputs[1][0];

  let prev = this._prev;
  let curr = this._curr;

  const diff = Math.abs(inval - curr);

  if (delta <= diff) {
    prev = curr;
    curr = inval;
  }

  fill(out, prev);

  this._prev = prev;
  this._curr = curr;
};

SCUnitRepository.registerSCUnitClass("LastValue", SCUnitLastValue);

module.exports = SCUnitLastValue;
