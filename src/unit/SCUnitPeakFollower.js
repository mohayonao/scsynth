"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitPeakFollower extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._slopeFactor = rate.slopeFactor;
    this._decay = this.inputs[1][0];
    this.outputs[0][0] = this._level = this.inputs[0][0];
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const decay = this.inputs[1][0];
  let level = this._level;
  if (decay === this._decay) {
    for (let i = 0; i < inNumSamples; i++) {
      const inlevel = Math.abs(inIn[i]);
      if (inlevel >= level) {
        level = inlevel;
      } else {
        level = inlevel + decay * (level - inlevel);
      }
      out[i] = level;
    }
  } else {
    let decay_slope = (decay - this._decay) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const inlevel = Math.abs(inIn[i]);
      if (inlevel >= level) {
        level = inlevel;
      } else {
        level = (1 - Math.abs(decay + decay_slope * i)) * inlevel + decay * level;
      }
      out[i] = level;
    }
  }
  this._level = level;
  this._decay = decay;
};
SCUnitRepository.registerSCUnitClass("PeakFollower", SCUnitPeakFollower);
module.exports = SCUnitPeakFollower;
