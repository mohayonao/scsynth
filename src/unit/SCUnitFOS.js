"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitFOS extends SCUnit {
  initialize(rate) {
    if (this.bufferLength === 1) {
      this.dspProcess = dspProcess["next_1"];
    } else {
      if (this.inputSpecs[1].rate === C.RATE_AUDIO && this.inputSpecs[2].rate === C.RATE_AUDIO && this.inputSpecs[3].rate === C.RATE_AUDIO) {
        this.dspProcess = dspProcess["next_a"];
      } else {
        this.dspProcess = dspProcess["next_k"];
      }
    }
    this._filterSlope = rate.filterSlope;
    this._y1 = 0;
    this._a0 = 0;
    this._a1 = 0;
    this._b1 = 0;
    this.dspProcess(1);
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const a0In = this.inputs[1];
  const a1In = this.inputs[2];
  const b1In = this.inputs[3];
  let y1 = this._y1;
  for (let i = 0; i < inNumSamples; i++) {
    const y0 = inIn[i] + b1In[i] * y1;
    out[i] = a0In[i] * y0 + a1In[i] * y1 || 0;
    y1 = y0;
  }
  this._y1 = y1;
};
dspProcess["next_1"] = function () {
  const _in = this.inputs[0][0];
  const a0 = this.inputs[1][0];
  const a1 = this.inputs[2][0];
  const b1 = this.inputs[3][0];
  const y1 = this._y1;
  const y0 = _in + b1 * y1;
  this.outputs[0][0] = a0 * y0 + a1 * y1 || 0;
  this._y1 = y0;
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const next_a0 = this.inputs[1][0];
  const next_a1 = this.inputs[2][0];
  const next_b1 = this.inputs[3][0];
  const a0 = this._a0;
  const a1 = this._a1;
  const b1 = this._b1;
  const a0_slope = (next_a0 - a0) * this._filterSlope;
  const a1_slope = (next_a1 - a1) * this._filterSlope;
  const b1_slope = (next_b1 - b1) * this._filterSlope;
  let y1 = this._y1;
  for (let i = 0; i < inNumSamples; i++) {
    const y0 = inIn[i] + (b1 + b1_slope * i) * y1;
    out[i] = (a0 + a0_slope * i) * y0 + (a1 + a1_slope * i) * y1 || 0;
    y1 = y0;
  }
  this._y1 = y1;
  this._a0 = a0;
  this._a1 = a1;
  this._b1 = b1;
};
SCUnitRepository.registerSCUnitClass("FOS", SCUnitFOS);
module.exports = SCUnitFOS;
