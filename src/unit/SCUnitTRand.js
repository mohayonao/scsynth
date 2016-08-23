"use strict";

const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitTRand extends SCUnit {
  initialize() {
    if (this.inputSpecs[2].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["kka"];
    } else {
      this.dspProcess = dspProcess["kkk"];
    }

    const lo = this.inputs[0][0];
    const hi = this.inputs[1][0];

    this._trig = this.inputs[2][0];
    this._value = Math.random() * (hi - lo) + lo;

    this.outputs[0][0] = this._value;
  }
}

dspProcess["kka"] = function(inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[2];

  let value = this._value;
  let trig = this._trig;

  for (let i = 0; i < inNumSamples; i++) {
    const trig_next = trigIn[i];

    if (trig <= 0 && 0 < trig_next) {
      const lo = this.inputs[0][0];
      const hi = this.inputs[1][0];

      value = Math.random() * (hi - lo) + lo;
    }

    out[i] = value;
    trig = trig_next;
  }

  this._trig = trig;
  this._value = value;
};

dspProcess["kkk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const trig_next = this.inputs[2][0];
  const trig = this._trig;

  if (trig <= 0 && 0 < trig_next) {
    const lo = this.inputs[0][0];
    const hi = this.inputs[1][0];

    this._value = Math.random() * (hi - lo) + lo;
  }

  const value = this._value;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = value;
  }

  this._trig = trig_next;
};

SCUnitRepository.registerSCUnitClass("TRand", SCUnitTRand);

module.exports = SCUnitTRand;
