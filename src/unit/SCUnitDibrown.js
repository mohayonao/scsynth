"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const sc_fold = require("../util/sc_fold");
const dspProcess = {};

class SCUnitDibrown extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && this.inputs.length === 4
    );

    this.dspProcess = dspProcess["d"];

    this._lo = 0;
    this._hi = 0;
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

  const lo = demand.next(this, 1, inNumSamples);
  const hi = demand.next(this, 2, inNumSamples);
  const step = demand.next(this, 3, inNumSamples);

  if (!Number.isNaN(lo)) {
    this._lo = lo;
  }
  if (!Number.isNaN(hi)) {
    this._hi = hi;
  }
  if (!Number.isNaN(step)) {
    this._step = step;
  }

  if (this._repeats < 0) {
    const x = demand.next(this, 0, inNumSamples);

    this._repeats = Number.isNaN(x) ? 0 : Math.max(0, Math.floor(x + 0.5));
    this._value = Math.floor(Math.random() * (this._hi - this._lo) + this._lo);
  }

  const out = this.outputs[0];

  if (this._repeats <= this._repeatCount) {
    out[0] = NaN;
    return;
  }

  this._repeatCount += 1;

  out[0] = this._value;

  const value = this._value + (Math.random() * 2 - 1) * this._step;

  this._value = Math.floor(sc_fold(value, this._lo, this._hi));
};

SCUnitRepository.registerSCUnitClass("Dibrown", SCUnitDibrown);

module.exports = SCUnitDibrown;
