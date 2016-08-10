"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitA2K extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["a"];
  }
}

dspProcess["a"] = function() {
  this.outputs[0][0] = this.inputs[0][0];
};

SCUnitRepository.registerSCUnitClass("A2K", SCUnitA2K);

module.exports = SCUnitA2K;
