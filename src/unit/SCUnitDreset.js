"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDreset extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && this.inputs.length === 2
    );

    this._prev_reset = 0;

    this.dspProcess = dspProcess["d"];
  }

  reset() {
    demand.reset(this, 0);
  }
}

dspProcess["d"] = function(inNumSamples) {
  if (inNumSamples === 0) {
    return this.reset();
  }

  const out = this.outputs[0];
  const x = demand.next(this, 0, inNumSamples);
  const reset = demand.next(this, 1, inNumSamples);

  if (Number.isNaN(x)) {
    out[0] = NaN;
    return;
  }

  if (0 < reset && this._prev_reset <= 0) {
    demand.reset(this, 0);
  }
  this._prev_reset = reset;

  out[0] = x;
};

SCUnitRepository.registerSCUnitClass("Dreset", SCUnitDreset);

module.exports = SCUnitDreset;
