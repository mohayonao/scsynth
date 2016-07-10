"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitIn extends SCUnit {
  initialize() {
    if (this.calcRate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["a"];
      this._buses = this.context.audioBuses;
    } else {
      this.dspProcess = dspProcess["k"];
      this._buses = this.context.controlBuses;
    }
  }
}
dspProcess["a"] = function () {
  this.outputs[0].set(this._buses[this.inputs[0][0] | 0]);
};
dspProcess["k"] = function () {
  this.outputs[0][0] = this._buses[this.inputs[0][0] | 0][0];
};
SCUnitRepository.registerSCUnitClass("In", SCUnitIn);
module.exports = SCUnitIn;
