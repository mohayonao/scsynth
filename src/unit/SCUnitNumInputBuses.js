"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitNumInputBuses extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.numberOfChannels;
  }
}
SCUnitRepository.registerSCUnitClass("NumInputBuses", SCUnitNumInputBuses);
module.exports = SCUnitNumInputBuses;
