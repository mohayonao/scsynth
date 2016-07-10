"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitNumControlBuses extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.numberOfControlBus;
  }
}
SCUnitRepository.registerSCUnitClass("NumControlBuses", SCUnitNumControlBuses);
module.exports = SCUnitNumControlBuses;
