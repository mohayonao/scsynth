"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDswitch1 extends SCUnit {
  initialize() {
    assert(
      this.calcRate === C.RATE_DEMAND && 2 <= this.inputs.length
    );

    this.dspProcess = dspProcess["d"];
  }

  reset() {
    for (let i = 0, imax = this.inputs.length; i < imax; i++) {
      demand.reset(this, i);
    }
  }
}

dspProcess["d"] = function(inNumSamples) {
  if (inNumSamples === 0) {
    return this.reset();
  }

  const out = this.outputs[0];
  const x = demand.next(this, 0);

  if (Number.isNaN(x)) {
    out[0] = NaN;
    return;
  }

  const index = (Math.floor(x + 0.5) % (this.inputs.length - 1)) + 1;

  out[0] = demand.next(this, index, inNumSamples);
};

SCUnitRepository.registerSCUnitClass("Dswitch1", SCUnitDswitch1);

module.exports = SCUnitDswitch1;
