"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDswitch extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && 2 <= this.inputs.length
    );

    this._index = computeIndex(demand.next(this, 0, 1), this.inputs.length);

    this.dspProcess = dspProcess["d"];
  }

  reset() {
    for (let i = 0, imax = this.inputs.length; i < imax; i++) {
      demand.reset(this, i);
    }
    this._index = computeIndex(demand.next(this, 0, 1), this.inputs.length);
  }
}

function computeIndex(index, length) {
  index = index = (index|0) % (length - 1);
  if (index < 0) {
    index += length - 1;
  }
  return index + 1;
}

dspProcess["d"] = function(inNumSamples) {
  if (inNumSamples === 0) {
    return this.reset();
  }

  const out = this.outputs[0];

  let val = demand.next(this, this._index, inNumSamples);

  if (Number.isNaN(val)) {
    const ival = demand.next(this, 0, inNumSamples);

    if (Number.isNaN(ival)) {
      val = NaN;
    } else {
      const index = computeIndex(ival, this.inputs.length);

      val = demand.next(this, index, inNumSamples);
      demand.reset(this, this._index);

      this._index = index;
    }
  }

  out[0] = val;
};

SCUnitRepository.registerSCUnitClass("Dswitch", SCUnitDswitch);

module.exports = SCUnitDswitch;
