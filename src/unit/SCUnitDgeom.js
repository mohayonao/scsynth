"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDgeom extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && this.inputs.length === 3
    );

    this.dspProcess = dspProcess["d"];

    this._grow = 1;
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
  const grow = demand.next(this, 2, inNumSamples);

  if (!Number.isNaN(grow)) {
    this._grow = grow;
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
  this._value *= this._grow;
  this._repeatCount += 1;
};

SCUnitRepository.registerSCUnitClass("Dgeom", SCUnitDgeom);

module.exports = SCUnitDgeom;
