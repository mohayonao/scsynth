"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fillRange = require("../util/fillRange");
const dspProcess = {};

class SCUnitK2A extends SCUnit {
  initialize() {
    assert(this.inputs.length === 1);
    this.dspProcess = dspProcess["a"];
  }
}

dspProcess["a"] = function(inNumSamples) {
  fillRange(this.outputs[0], this.inputs[0][0], 0, inNumSamples);
};

SCUnitRepository.registerSCUnitClass("K2A", SCUnitK2A);

module.exports = SCUnitK2A;
