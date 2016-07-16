"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDstutter extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && this.inputs.length === 2
    );

    this.dspProcess = dspProcess["d"];

    this.reset();
  }

  reset() {
    this._repeats = -1;
    this._repeatCount = 0;
    demand.reset(this, 0);
    demand.reset(this, 1);
  }
}

dspProcess["d"] = function(inNumSamples) {
  if (inNumSamples === 0) {
    return this.reset();
  }

  const out = this.outputs[0];

  if (this._repeats <= this._repeatCount) {
    const value = demand.next(this, 1, inNumSamples);
    const repeats = demand.next(this, 0, inNumSamples);

    if (Number.isNaN(value) || Number.isNaN(repeats)) {
      out[0] = NaN;
      return;
    }

    this._value = value;
    this._repeats = Math.max(0, Math.floor(repeats + 0.5));
    this._repeatCount = 0;
  }

  out[0] = this._value;
  this._repeatCount += 1;
};

SCUnitRepository.registerSCUnitClass("Dstutter", SCUnitDstutter);

module.exports = SCUnitDstutter;
