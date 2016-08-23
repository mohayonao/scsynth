"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

class SCUnitLinRand extends SCUnit {
  initialize() {
    const lo = this.inputs[0][0];
    const hi = this.inputs[1][0];
    const n = this.inputs[2][0]|0;
    const range = hi - lo;
    const a = Math.random();
    const b = Math.random();

    if (n <= 0) {
      this.outputs[0][0] = Math.min(a, b) * range + lo;
    } else {
      this.outputs[0][0] = Math.max(a, b) * range + lo;
    }
  }
}

SCUnitRepository.registerSCUnitClass("LinRand", SCUnitLinRand);

module.exports = SCUnitLinRand;
