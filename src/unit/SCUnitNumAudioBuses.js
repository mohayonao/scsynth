"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
class SCUnitNumAudioBuses extends SCUnit {
  initialize() {
    this.outputs[0][0] = this.context.numberOfAudioBus;
  }
}
SCUnitRepository.registerSCUnitClass("NumAudioBuses", SCUnitNumAudioBuses);
module.exports = SCUnitNumAudioBuses;
