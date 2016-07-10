"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitDecay2 extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._attackTime = NaN;
    this._decayTime = NaN;
    this._b1a = 0;
    this._b1b = 0;
    this._y1a = 0;
    this._y1b = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const attackTime = this.inputs[1][0];
  const decayTime = this.inputs[2][0];
  const b1a = this._b1a;
  const b1b = this._b1b;
  let y1a = this._y1a;
  let y1b = this._y1b;
  if (attackTime === this._attackTime && decayTime === this._decayTime) {
    for (let i = 0; i < inNumSamples; i++) {
      y1a = inIn[i] + b1a * y1a;
      y1b = inIn[i] + b1b * y1b;
      out[i] = y1a - y1b;
    }
  } else {
    const next_b1a = decayTime !== 0 ? Math.exp(log001 / (decayTime * this._sampleRate)) : 0;
    const next_b1b = attackTime !== 0 ? Math.exp(log001 / (attackTime * this._sampleRate)) : 0;
    const b1a_slope = (next_b1a - b1a) * this._slopeFactor;
    const b1b_slope = (next_b1b - b1b) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      y1a = inIn[i] + (b1a + b1a_slope * i) * y1a;
      y1b = inIn[i] + (b1b + b1b_slope * i) * y1b;
      out[i] = y1a - y1b;
    }
    this._b1a = next_b1a;
    this._b1b = next_b1b;
    this._decayTime = decayTime;
    this._attackTime = attackTime;
  }
  this._y1a = y1a;
  this._y1b = y1b;
};
SCUnitRepository.registerSCUnitClass("Decay2", SCUnitDecay2);
module.exports = SCUnitDecay2;
