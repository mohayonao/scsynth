"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitReplaceOut extends SCUnit {
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
dspProcess["a"] = function (inNumSamples) {
  const inputs = this.inputs;
  const buses = this._buses;
  const firstBusChannel = (inputs[0][0] | 0) - 1;
  for (let i = 1, imax = inputs.length; i < imax; i++) {
    const bus = buses[firstBusChannel + i];
    const _in = inputs[i];
    bus.set(_in.subarray(0, inNumSamples));
  }
};
dspProcess["k"] = function () {
  const inputs = this.inputs;
  const buses = this._buses;
  const offset = (inputs[0][0] | 0) - 1;
  for (let i = 1, imax = inputs.length; i < imax; i++) {
    buses[offset + i][0] = inputs[i][0];
  }
};
SCUnitRepository.registerSCUnitClass("ReplaceOut", SCUnitReplaceOut);
module.exports = SCUnitReplaceOut;
