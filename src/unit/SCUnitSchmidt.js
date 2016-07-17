"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitSchmidt extends SCUnit {
  initialize() {
    assert(this.inputs.length === 3);

    this.dspProcess = dspProcess["akk"];

    this._level = 0;

    this.dspProcess(1);
  }
}

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const lo = this.inputs[1][0];
  const hi = this.inputs[2][0];

  let level = this._level;

  for (let i = 0; i < inNumSamples; i++) {
    const zin = inIn[i];

    if (level === 1) {
      if (zin < lo) {
        level = 0;
      }
    } else {
      if (hi < zin) {
        level = 1;
      }
    }
    out[i] = level;
  }

  this._level = level;
};

SCUnitRepository.registerSCUnitClass("Schmidt", SCUnitSchmidt);

module.exports = SCUnitSchmidt;
