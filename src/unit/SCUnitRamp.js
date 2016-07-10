"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitRamp extends SCUnit {
  initialize(rate) {
    if (this.bufferLength === 1) {
      this.dspProcess = dspProcess["1"];
    } else {
      this.dspProcess = dspProcess["k"];
    }
    this._sampleRate = rate.sampleRate;
    this._counter = 1;
    this._level = this.inputs[0][0];
    this._slope = 0;
    this.outputs[0][0] = this._level;
  }
}
dspProcess["k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const period = this.inputs[1][0];
  const sampleRate = this._sampleRate;
  let slope = this._slope;
  let level = this._level;
  let counter = this._counter;
  let remain = inNumSamples;
  let j = 0;
  while (remain) {
    const nsmps = Math.min(remain, counter);
    for (let i = 0; i < nsmps; i++) {
      out[j++] = level;
      level += slope;
    }
    counter -= nsmps;
    remain -= nsmps;
    if (counter <= 0) {
      counter = period * sampleRate | 0;
      counter = Math.max(1, counter);
      slope = (inIn[j - 1] - level) / counter;
    }
  }
  this._level = level;
  this._slope = slope;
  this._counter = counter;
};
dspProcess["1"] = function () {
  const out = this.outputs[0];
  out[0] = this._level;
  this._level += this._slope;
  this._counter -= 1;
  if (this._counter <= 0) {
    const _in = this.inputs[0][0];
    const period = this.inputs[1][0];
    const counter = period * this._sampleRate | 0;
    this._counter = Math.max(1, counter);
    this._slope = (_in - this._level) / this._counter;
  }
};
SCUnitRepository.registerSCUnitClass("Ramp", SCUnitRamp);
module.exports = SCUnitRamp;
