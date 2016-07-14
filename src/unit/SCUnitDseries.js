"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDseries extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && this.inputs.length === 3
    );

    this.dspProcess = dspProcess["d"];

    this._step = 0;
    this._value = 0;

    this.reset();
  }

  reset() {
    this._repeats = -1;
    this._repeatCount = 0;
  }
}

dspProcess["d"] = function(inNumSamples) {
  if (inNumSamples === 0) {
    return this.reset();
  }

  const out = this.outputs[0];
  const step = demand.next(this, 2, inNumSamples);

  if (!Number.isNaN(step)) {
    this._step = step;
  }
  if (this._repeats < 0) {
    const x = demand.next(this, 0, inNumSamples);

    this._repeats = Math.floor(x);
    this._value = demand.next(this, 1, inNumSamples);
  }

  if (this._repeats <= this._repeatCount) {
    out[0] = NaN;
    return;
  }

  out[0] = this._value;
  this._value += this._step;
  this._repeatCount += 1;
};

SCUnitRepository.registerSCUnitClass("Dseries", SCUnitDseries);

module.exports = SCUnitDseries;
