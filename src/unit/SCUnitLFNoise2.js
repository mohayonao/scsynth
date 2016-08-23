"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitLFNoise2 extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];

    this._sampleRate = rate.sampleRate;
    this._level = 0;
    this._counter = 0;
    this._slope = 0;
    this._curve = 0;
    this._nextValue = Math.random() * 2 - 1;
    this._nextMidPt = this._nextValue * 0.5;

    this.dspProcess(1);
  }
}

dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = Math.max(0.001, this.inputs[0][0]);

  let level = this._level;
  let slope = this._slope;
  let curve = this._curve;
  let counter = this._counter;
  let remain = inNumSamples;
  let j = 0;

  do {
    if (counter <= 0) {
      const value = this._nextValue;

      this._nextValue = Math.random() * 2 - 1;

      level = this._nextMidPt;

      this._nextMidPt = (this._nextValue + value) * 0.5;
      counter = Math.max(2, (this._sampleRate / freq)|0);

      const fseglen = counter;

      curve = 2 * (this._nextMidPt - level - fseglen * slope) / (fseglen * fseglen + fseglen);
    }

    const nsmps = Math.min(remain, counter);

    for (let i = 0; i < nsmps; i++) {
      out[j++] = level;
      slope += curve;
      level += slope;
    }

    remain -= nsmps;
    counter -= nsmps;
  } while (remain);

  this._level = level;
  this._slope = slope;
  this._curve = curve;
  this._counter = counter;
};

SCUnitRepository.registerSCUnitClass("LFNoise2", SCUnitLFNoise2);

module.exports = SCUnitLFNoise2;
