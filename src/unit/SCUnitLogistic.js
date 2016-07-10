"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLogistic extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._y1 = this.inputs[2][0];
    this._counter = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const paramf = this.inputs[0][0];
  const freq = this.inputs[1][0];
  const sampleRate = this._sampleRate;
  let y1 = this._y1;
  let counter = this._counter;
  let remain = inNumSamples;
  let j = 0;
  do {
    if (counter <= 0) {
      counter = Math.max(1, sampleRate / Math.max(0.001, freq)) | 0;
      y1 = paramf * y1 * (1 - y1);
    }
    const nsmps = Math.min(counter, remain);
    counter -= nsmps;
    remain -= nsmps;
    for (let i = 0; i < nsmps; i++) {
      out[j++] = y1;
    }
  } while (remain);
  this._y1 = y1;
  this._counter = counter;
};
SCUnitRepository.registerSCUnitClass("Logistic", SCUnitLogistic);
module.exports = SCUnitLogistic;
