"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

class SCUnitNRand extends SCUnit {
  initialize() {
    const lo = this.inputs[0][0];
    const hi = this.inputs[1][0];
    const n = this.inputs[2][0]|0;
    const range = hi - lo;

    if (n) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += Math.random();
      }
      this.outputs[0][0] = (sum / n) * range + lo;
    }
  }
}

SCUnitRepository.registerSCUnitClass("NRand", SCUnitNRand);

module.exports = SCUnitNRand;
