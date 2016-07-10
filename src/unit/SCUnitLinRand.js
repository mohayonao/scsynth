"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitLinRand extends SCUnit {
  initialize() {
    let lo = this.inputs[0][0];
    let hi = this.inputs[1][0];
    let n = this.inputs[2][0] | 0;
    let range = hi - lo;
    let a = Math.random();
    let b = Math.random();
    if (n <= 0) {
      this.outputs[0][0] = Math.min(a, b) * range + lo;
    } else {
      this.outputs[0][0] = Math.max(a, b) * range + lo;
    }
  }
}
SCUnitRepository.registerSCUnitClass("LinRand", SCUnitLinRand);
module.exports = SCUnitLinRand;
