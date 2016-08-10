"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitDust extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["k"];

    this._sampleDur = rate.sampleDur;
    this._density = 0;
    this._scale = 0;
    this._thresh = 0;

    this.dspProcess(1);
  }
}

dspProcess["k"] = function(inNumSamples) {
  const out = this.outputs[0];
  const density_next = this.inputs[0][0];
  const density = this._density;

  if (density !== density_next) {
    this._thresh = density_next * this._sampleDur;
    this._scale = (0 < this._thresh) ? 1 / this._thresh : 0;
    this._density = density_next;
  }

  const thresh = this._thresh;
  const scale = this._scale;

  for (let i = 0; i < inNumSamples; i++) {
    const z = Math.random();

    out[i] = z < thresh ? z * scale : 0;
  }
};

SCUnitRepository.registerSCUnitClass("Dust", SCUnitDust);

module.exports = SCUnitDust;
