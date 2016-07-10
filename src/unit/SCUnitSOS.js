"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitSOS extends SCUnit {
  initialize(rate) {
    if (this.bufferLength !== 1) {
      if (this.inputSpecs[1].rate === C.RATE_AUDIO && this.inputSpecs[2].rate === C.RATE_AUDIO && this.inputSpecs[3].rate === C.RATE_AUDIO && this.inputSpecs[4].rate === C.RATE_AUDIO && this.inputSpecs[5].rate === C.RATE_AUDIO) {
        this.dspProcess = dspProcess["next_a"];
      } else if (this.inputSpecs[1].rate === C.RATE_SCALAR && this.inputSpecs[2].rate === C.RATE_SCALAR && this.inputSpecs[3].rate === C.RATE_SCALAR && this.inputSpecs[4].rate === C.RATE_SCALAR && this.inputSpecs[5].rate === C.RATE_SCALAR) {
        this.dspProcess = dspProcess["next_i"];
      } else {
        this.dspProcess = dspProcess["next_k"];
      }
    } else {
      this.dspProcess = dspProcess["next_1"];
    }
    this._slopeFactor = rate.slopeFactor;
    this._y1 = 0;
    this._y2 = 0;
    this._a0 = this.inputs[1][0];
    this._a1 = this.inputs[2][0];
    this._a2 = this.inputs[3][0];
    this._b1 = this.inputs[4][0];
    this._b2 = this.inputs[5][0];
    this.dspProcess(1);
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const a0In = this.inputs[1];
  const a1In = this.inputs[2];
  const a2In = this.inputs[3];
  const b1In = this.inputs[4];
  const b2In = this.inputs[5];
  let y1 = this._y1;
  let y2 = this._y2;
  for (let i = 0; i < inNumSamples; i++) {
    const y0 = inIn[i] + b1In[i] * y1 + b2In[i] * y2;
    out[i] = a0In[i] * y0 + a1In[i] * y1 + a2In[i] * y2;
    y2 = y1;
    y1 = y0;
  }
  this._y1 = y1;
  this._y2 = y2;
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const next_a0 = this.inputs[1][0];
  const next_a1 = this.inputs[2][0];
  const next_a2 = this.inputs[3][0];
  const next_b1 = this.inputs[4][0];
  const next_b2 = this.inputs[5][0];
  const a0 = this._a0;
  const a1 = this._a1;
  const a2 = this._a2;
  const b1 = this._b1;
  const b2 = this._b2;
  const a0_slope = (next_a0 - a0) * this._slopeFactor;
  const a1_slope = (next_a1 - a1) * this._slopeFactor;
  const a2_slope = (next_a2 - a2) * this._slopeFactor;
  const b1_slope = (next_b1 - b1) * this._slopeFactor;
  const b2_slope = (next_b2 - b2) * this._slopeFactor;
  let y1 = this._y1;
  let y2 = this._y2;
  for (let i = 0; i < inNumSamples; i++) {
    const y0 = inIn[i] + (b1 + b1_slope * i) * y1 + (b2 + b2_slope * i) * y2;
    out[i] = (a0 + a0_slope * i) * y0 + (a1 + a1_slope * i) * y1 + (a2 + a2_slope * i) * y2;
    y2 = y1;
    y1 = y0;
  }
  this._a0 = a0;
  this._a1 = a1;
  this._a2 = a2;
  this._b1 = b1;
  this._b2 = b2;
  this._y1 = y1;
  this._y2 = y2;
};
dspProcess["next_i"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const a0 = this._a0;
  const a1 = this._a1;
  const a2 = this._a2;
  const b1 = this._b1;
  const b2 = this._b2;
  let y1 = this._y1;
  let y2 = this._y2;
  for (let i = 0; i < inNumSamples; i++) {
    const y0 = inIn[i] + b1 * y1 + b2 * y2;
    out[i] = a0 * y0 + a1 * y1 + a2 * y2;
    y2 = y1;
    y1 = y0;
  }
  this._y1 = y1;
  this._y2 = y2;
};
dspProcess["next_1"] = function () {
  const _in = this.inputs[0][0];
  const a0 = this.inputs[1][0];
  const a1 = this.inputs[2][0];
  const a2 = this.inputs[3][0];
  const b1 = this.inputs[4][0];
  const b2 = this.inputs[5][0];
  let y1 = this._y1;
  let y2 = this._y2;
  const y0 = _in + b1 * y1 + b2 * y2;
  this.outputs[0][0] = a0 * y0 + a1 * y1 + a2 * y2;
  y2 = y1;
  y1 = y0;
  this._y1 = y1;
  this._y2 = y2;
};
SCUnitRepository.registerSCUnitClass("SOS", SCUnitSOS);
module.exports = SCUnitSOS;
