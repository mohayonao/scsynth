"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitK2A extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
  }
}
dspProcess["next"] = function (inNumSamples) {
  this.outputs[0].fill(this.inputs[0][0], 0, inNumSamples);
};
SCUnitRepository.registerSCUnitClass("K2A", SCUnitK2A);
module.exports = SCUnitK2A;
