"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitRadiansPerSample extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.aRate.radiansPerSample;
  }
}
SCUnitRepository.registerSCUnitClass("RadiansPerSample", SCUnitRadiansPerSample);
module.exports = SCUnitRadiansPerSample;
