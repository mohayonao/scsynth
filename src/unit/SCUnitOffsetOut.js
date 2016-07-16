"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

// TODO: use the sample offset ??
// Now, SCUnitOffsetOut == SCUnitOut

class SCUnitOffsetOut extends SCUnit {
  initialize() {
    assert(2 <= this.inputs.length);
    if (this.calcRate === C.RATE_AUDIO) {
      assert(
        this.inputSpecs.slice(1).every(
          (spec) => spec.rate === C.RATE_AUDIO
        )
      );
      this.dspProcess = dspProcess["a"];
      this._buses = this.context.audioBuses;
    } else {
      this.dspProcess = dspProcess["k"];
      this._buses = this.context.controlBuses;
    }
  }
}

dspProcess["a"] = function(inNumSamples) {
  const inputs = this.inputs;
  const buses = this._buses;
  const firstBusChannel = inputs[0][0]|0;

  for (let ch = 0, chmax = inputs.length - 1; ch < chmax; ch++) {
    const out = buses[firstBusChannel + ch];
    const inIn = inputs[ch + 1];

    for (let i = 0; i < inNumSamples; i++) {
      out[i] += inIn[i];
    }
  }
};

dspProcess["k"] = function() {
  const inputs = this.inputs;
  const buses = this._buses;
  const firstBusChannel = inputs[0][0]|0;

  for (let ch = 0, chmax = inputs.length - 1; ch < chmax; ch++) {
    const out = buses[firstBusChannel + ch];
    const _in = inputs[ch + 1][0];

    out[0] += _in;
  }
};

SCUnitRepository.registerSCUnitClass("OffsetOut", SCUnitOffsetOut);

module.exports = SCUnitOffsetOut;
