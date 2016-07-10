"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitDust extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleDur = rate.sampleDur;
    this._density = 0;
    this._scale = 0;
    this._thresh = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const density = this.inputs[0][0];
  if (density !== this._density) {
    this._thresh = density * this._sampleDur;
    this._scale = this._thresh > 0 ? 1 / this._thresh : 0;
    this._density = density;
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
