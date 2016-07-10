"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitSlope extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sr = rate.sampleRate;
    this._x1 = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const sr = this._sr;
  let x1 = this._x1;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = inIn[i];
    out[i] = sr * (x0 - x1);
    x1 = x0;
  }
  this._x1 = x1;
};
SCUnitRepository.registerSCUnitClass("Slope", SCUnitSlope);
module.exports = SCUnitSlope;
