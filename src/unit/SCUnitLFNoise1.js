"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitLFNoise1 extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];

    this._sampleRate = rate.sampleRate;
    this._level = Math.random() * 2 - 1;
    this._counter = 0;
    this._slope = 0;

    this.dspProcess(1);
  }
}

dspProcess["next"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freq = Math.max(0.001, this.inputs[0][0]);

  let level = this._level;
  let slope = this._slope;
  let counter = this._counter;
  let remain = inNumSamples;
  let j = 0;

  do {
    if (counter <= 0) {
      counter = Math.max(1, (this._sampleRate / freq)|0);
      slope = ((Math.random() * 2 - 1) - level) / counter;
    }

    const nsmps = Math.min(remain, counter);

    for (let i = 0; i < nsmps; i++) {
      out[j++] = level;
      level += slope;
    }

    remain -= nsmps;
    counter -= nsmps;
  } while (remain);

  this._level = level;
  this._slope = slope;
  this._counter = counter;
};

SCUnitRepository.registerSCUnitClass("LFNoise1", SCUnitLFNoise1);

module.exports = SCUnitLFNoise1;
