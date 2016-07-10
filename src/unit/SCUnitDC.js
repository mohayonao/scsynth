"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitDC extends SCUnit {
  initialize() {
    this.outputs[0].fill(this.inputs[0][0]);
  }
}
SCUnitRepository.registerSCUnitClass("DC", SCUnitDC);
module.exports = SCUnitDC;
