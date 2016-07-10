"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitControlRate extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.kRate.sampleRate;
  }
}
SCUnitRepository.registerSCUnitClass("ControlRate", SCUnitControlRate);
module.exports = SCUnitControlRate;
