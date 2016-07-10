"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLFClipNoise extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._counter = 0;
    this._level = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0];
  let level = this._level;
  let counter = this._counter;
  let remain = inNumSamples;
  let j = 0;
  do {
    if (counter <= 0) {
      counter = Math.max(1, this._sampleRate / Math.max(freq, 0.001) | 0);
      level = Math.random() < 0.5 ? -1 : +1;
    }
    const nsmps = Math.min(remain, counter);
    for (let i = 0; i < nsmps; i++) {
      out[j++] = level;
    }
    remain -= nsmps;
    counter -= nsmps;
  } while (remain);
  this._level = level;
  this._counter = counter;
};
SCUnitRepository.registerSCUnitClass("LFClipNoise", SCUnitLFClipNoise);
module.exports = SCUnitLFClipNoise;
