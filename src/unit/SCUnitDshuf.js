"use strict";

const assert = require("assert");
const nmap = require("nmap");
const shuffle = require("shuffle-array");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDShuf extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && 2 <= this.inputs.length
    );

    this.dspProcess = dspProcess["d"];

    this._indices = shuffle(nmap(this.inputs.length - 1, (_, i) => i + 1));

    this.reset();
  }

  reset() {
    this._repeats = -1;
    this._repeatCount = 0;
    this._index = 0;
    this._needToResetChild = true;
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

  for (;;) {
    if (this._indices.length <= this._index) {
      this._index = 0;
      this._repeatCount += 1;
    }

    if (this._repeats <= this._repeatCount) {
      out[0] = NaN;
      return;
    }

    const index = this._indices[this._index];

    if (!demand.isDemand(this, index)) {
      out[0] = demand.next(this, index, inNumSamples);
      this._index += 1;
      this._needToResetChild = true;
      return;
    }

    if (this._needToResetChild) {
      this._needToResetChild = false;
      demand.reset(this, index);
    }

    const x = demand.next(this, index, inNumSamples);

    if (Number.isNaN(x)) {
      this._index += 1;
      this._needToResetChild = true;
    } else {
      out[0] = x;
      return;
    }
  }
};

SCUnitRepository.registerSCUnitClass("DShuf", SCUnitDShuf);

module.exports = SCUnitDShuf;
