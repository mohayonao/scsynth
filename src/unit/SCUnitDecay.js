"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitDecay extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._decayTime = NaN;
    this._b1 = 0;
    this._y1 = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const decayTime = this.inputs[1][0];
  let b1 = this._b1;
  let y1 = this._y1;
  if (decayTime === this._decayTime) {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = y1 = inIn[i] + b1 * y1;
    }
  } else {
    const next_b1 = decayTime !== 0 ? Math.exp(log001 / (decayTime * this._sampleRate)) : 0;
    const b1_slope = (next_b1 - b1) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = y1 = inIn[i] + (b1 + b1_slope * i) * y1;
    }
    this._b1 = next_b1;
    this._decayTime = decayTime;
  }
  this._y1 = y1;
};
SCUnitRepository.registerSCUnitClass("Decay", SCUnitDecay);
module.exports = SCUnitDecay;
