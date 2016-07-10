"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitRand extends SCUnit {
  initialize() {
    let lo = this.inputs[0][0];
    let hi = this.inputs[1][0];
    let range = hi - lo;
    this.outputs[0][0] = Math.random() * range + lo;
  }
}
SCUnitRepository.registerSCUnitClass("Rand", SCUnitRand);
module.exports = SCUnitRand;
