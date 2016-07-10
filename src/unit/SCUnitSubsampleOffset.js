"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitSubsampleOffset extends SCUnit {
  initialize() {
    this.outputs[0][0] = 0;
  }
}
SCUnitRepository.registerSCUnitClass("SubsampleOffset", SCUnitSubsampleOffset);
module.exports = SCUnitSubsampleOffset;
