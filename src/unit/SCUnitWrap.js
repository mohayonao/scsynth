"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sc_wrap = require("../util/sc_wrap");
const dspProcess = {};
class SCUnitWrap extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[1].rate === C.RATE_AUDIO && this.inputSpecs[2].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_aa"];
    } else {
      this.dspProcess = dspProcess["next_kk"];
    }
    this._slopeFactor = rate.slopeFactor;
    this._lo = this.inputs[1][0];
    this._hi = this.inputs[2][0];
    this.dspProcess(1);
  }
}
dspProcess["next_aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const loIn = this.inputs[1];
  const hiIn = this.inputs[2];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = sc_wrap(inIn[i], loIn[i], hiIn[i]);
  }
};
dspProcess["next_kk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const next_lo = this.inputs[1][0];
  const next_hi = this.inputs[2][0];
  const lo = this._lo;
  const hi = this._hi;
  if (next_lo === lo && next_hi === hi) {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = sc_wrap(inIn[i], lo, hi);
    }
  } else {
    const lo_slope = (next_lo - lo) * this._slopeFactor;
    const hi_slope = (next_hi - hi) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = sc_wrap(inIn[i], lo + lo_slope * i, hi + hi_slope * i);
    }
    this._lo = next_lo;
    this._hi = next_hi;
  }
};
SCUnitRepository.registerSCUnitClass("Wrap", SCUnitWrap);
module.exports = SCUnitWrap;
