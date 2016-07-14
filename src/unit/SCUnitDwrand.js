"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDwrand extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && 4 <= this.inputs.length
    );

    this.dspProcess = dspProcess["d"];

    this._weightsSize = this.inputs[1][0];

    assert(
      // [ repeat, size, ...weights, ...values ]
      this.inputs.length === 2 + this._weightsSize * 2
    );
    this._index = 2 + this._weightsSize;

    this.reset();
  }

  reset() {
    this._repeats = -1;
    this._repeatCount = 0;
    this._needToResetChild = true;
  }
}

function nextIndex(inputs, length) {
  const r = Math.random();

  let sum = 0;

  for (let i = 0; i < length; i++) {
    sum += inputs[i + 2][0];
    if (r <= sum) {
      return i + (2 + length);
    }
  }

  return inputs.length - 1;
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
    if (this._repeats <= this._repeatCount) {
      out[0] = NaN;
      return;
    }

    if (!demand.isDemand(this, this._index)) {
      out[0] = demand.next(this, this._index, inNumSamples);
      this._index = nextIndex(this.inputs, this._weightsSize);
      this._repeatCount += 1;
      this._needToResetChild = true;
      return;
    }

    if (this._needToResetChild) {
      this._needToResetChild = false;
      demand.reset(this, this._index);
    }

    const x = demand.next(this, this._index, inNumSamples);

    if (Number.isNaN(x)) {
      this._index = nextIndex(this.inputs, this._weightsSize);
      this._repeatCount += 1;
      this._needToResetChild = true;
    } else {
      out[0] = x;
      return;
    }
  }
};

SCUnitRepository.registerSCUnitClass("Dwrand", SCUnitDwrand);

module.exports = SCUnitDwrand;
