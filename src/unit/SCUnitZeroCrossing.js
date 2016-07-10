"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitZeroCrossing extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._prevfrac = 0;
    this._previn = this.inputs[0][0];
    this._counter = 0;
    this.outputs[0][0] = this._level = 0;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const sampleRate = this._sampleRate;
  let previn = this._previn;
  let prevfrac = this._prevfrac;
  let level = this._level;
  let counter = this._counter;
  for (let i = 0; i < inNumSamples; i++) {
    const curin = inIn[i];
    counter += 1;
    if (counter > 4 && previn <= 0 && curin > 0) {
      const frac = -previn / (curin - previn);
      level = sampleRate / (frac + counter - prevfrac);
      prevfrac = frac;
      counter = 0;
    }
    out[i] = level;
    previn = curin;
  }
  this._previn = previn;
  this._prevfrac = prevfrac;
  this._level = level;
  this._counter = counter;
};
SCUnitRepository.registerSCUnitClass("ZeroCrossing", SCUnitZeroCrossing);
module.exports = SCUnitZeroCrossing;
