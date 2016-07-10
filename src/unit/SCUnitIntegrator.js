"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitIntegrator extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._slopeFactor = rate.slopeFactor;
    this._b1 = this.inputs[1][0];
    this._y1 = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const next_b1 = this.inputs[1][0];
  const b1 = this._b1;
  let y1 = this._y1;
  if (b1 === next_b1) {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = y1 = inIn[i] + b1 * y1;
    }
  } else {
    const b1_slope = (next_b1 - b1) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = y1 = inIn[i] + (b1 + b1_slope * i) * y1;
    }
    this._b1 = next_b1;
  }
  this._y1 = y1;
};
SCUnitRepository.registerSCUnitClass("Integrator", SCUnitIntegrator);
module.exports = SCUnitIntegrator;
