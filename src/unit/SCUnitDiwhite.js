"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDiwhite extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && this.inputs.length === 3
    );

    this.dspProcess = dspProcess["d"];

    this._lo = 0;
    this._range = 0;

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

  if (this._repeats < 0) {
    const x = demand.next(this, 0, inNumSamples);

    this._repeats = Number.isNaN(x) ? 0 : Math.max(0, Math.floor(x + 0.5));
  }

  const out = this.outputs[0];

  if (this._repeats <= this._repeatCount) {
    out[0] = NaN;
    return;
  }

  this._repeatCount += 1;

  const lo = demand.next(this, 1, inNumSamples);
  const hi = demand.next(this, 2, inNumSamples);

  if (!Number.isNaN(lo)) {
    this._lo = lo;
  }
  if (!Number.isNaN(hi)) {
    this._range = hi - this._lo + 1;
  }

  out[0] = Math.floor(Math.random() * this._range + this._lo);
};

SCUnitRepository.registerSCUnitClass("Diwhite", SCUnitDiwhite);

module.exports = SCUnitDiwhite;
