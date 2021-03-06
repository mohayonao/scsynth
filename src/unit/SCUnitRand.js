"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

class SCUnitRand extends SCUnit {
  initialize() {
    const lo = this.inputs[0][0];
    const hi = this.inputs[1][0];

    this.outputs[0][0] = Math.random() * (hi - lo) + lo;
  }
}

SCUnitRepository.registerSCUnitClass("Rand", SCUnitRand);

module.exports = SCUnitRand;
