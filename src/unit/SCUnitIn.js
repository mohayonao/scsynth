"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

const dspProcess = {};

class SCUnitIn extends SCUnit {
  initialize() {
    assert(this.inputs.length === 1);
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
  const outputs = this.outputs;
  const buses = this._buses;
  const firstBusChannel = this.inputs[0][0]|0;

  for (let ch = 0, chmax = outputs.length; ch < chmax; ch++) {
    outputs[ch].set(buses[firstBusChannel + ch]);
  }
};

dspProcess["k"] = function () {
  const outputs = this.outputs;
  const buses = this._buses;
  const firstBusChannel = this.inputs[0][0]|0;

  for (let ch = 0, chmax = outputs.length; ch < chmax; ch++) {
    outputs[ch][0] = buses[firstBusChannel + ch][0];
  }
};

SCUnitRepository.registerSCUnitClass("In", SCUnitIn);

module.exports = SCUnitIn;
