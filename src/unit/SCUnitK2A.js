"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fillRange = require("../util/fillRange");
const dspProcess = {};

class SCUnitK2A extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["a"];
  }
}

dspProcess["a"] = function(inNumSamples) {
  fillRange(this.outputs[0], this.inputs[0][0], 0, inNumSamples);
};

SCUnitRepository.registerSCUnitClass("K2A", SCUnitK2A);

module.exports = SCUnitK2A;
