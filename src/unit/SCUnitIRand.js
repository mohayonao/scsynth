"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitIRand extends SCUnit {
  initialize() {
    const lo = this.inputs[0][0];
    const hi = this.inputs[1][0];
    const range = hi - lo;
    this.outputs[0][0] = Math.random() * range + lo | 0;
  }
}
SCUnitRepository.registerSCUnitClass("IRand", SCUnitIRand);
module.exports = SCUnitIRand;
