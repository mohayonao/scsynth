"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitSampleRate extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.aRate.sampleRate;
  }
}
SCUnitRepository.registerSCUnitClass("SampleRate", SCUnitSampleRate);
module.exports = SCUnitSampleRate;
