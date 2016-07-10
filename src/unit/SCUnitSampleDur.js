"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitSampleDur extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.aRate.sampleDur;
  }
}
SCUnitRepository.registerSCUnitClass("SampleDur", SCUnitSampleDur);
module.exports = SCUnitSampleDur;
