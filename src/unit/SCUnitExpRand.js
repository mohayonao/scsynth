"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitExpRand extends SCUnit {
  initialize() {
    const lo = this.inputs[0][0] || 0.01;
    const hi = this.inputs[1][0];
    const ratio = hi / lo;
    this.outputs[0][0] = Math.pow(ratio, Math.random()) * lo;
  }
}
SCUnitRepository.registerSCUnitClass("ExpRand", SCUnitExpRand);
module.exports = SCUnitExpRand;
