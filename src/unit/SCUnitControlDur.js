"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitControlDur extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.kRate.sampleDur;
  }
}
SCUnitRepository.registerSCUnitClass("ControlDur", SCUnitControlDur);
module.exports = SCUnitControlDur;
