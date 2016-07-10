"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitNumOutputBuses extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.numberOfChannels;
  }
}
SCUnitRepository.registerSCUnitClass("NumOutputBuses", SCUnitNumOutputBuses);
module.exports = SCUnitNumOutputBuses;
