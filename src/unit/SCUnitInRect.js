"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitInRect extends SCUnit {
  initialize() {
    assert(this.inputs.length === 6);
    assert(this.inputSpecs[0].rate === this.inputSpecs[1].rate);
    this.dspProcess = dspProcess["aakkkk"];
  }
}

dspProcess["aakkkk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const xIn = this.inputs[0];
  const yIn = this.inputs[1];
  const left = this.inputs[2][0];
  const top = this.inputs[3][0];
  const right = this.inputs[4][0];
  const bottom = this.inputs[5][0];

  for (let i = 0; i < inNumSamples; i++) {
    const x = xIn[i];
    const y = yIn[i];

    out[i] = (left <= x && x <= right) && (top <= y && y <= bottom) ? 1 : 0;
  }
};

SCUnitRepository.registerSCUnitClass("InRect", SCUnitInRect);

module.exports = SCUnitInRect;
