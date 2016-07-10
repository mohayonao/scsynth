"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitXLine extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    const start = this.inputs[0][0] || 0.001;
    const end = this.inputs[1][0] || 0.001;
    const dur = this.inputs[2][0];
    const counter = Math.round(dur * rate.sampleRate);
    if (counter === 0) {
      this._level = end;
      this._counter = 0;
      this._growth = 0;
    } else {
      this._counter = counter;
      this._growth = Math.pow(end / start, 1 / counter);
      this._level = start * this._growth;
    }
    this._endLevel = end;
    this._doneAction = this.inputs[3][0];
    this.outputs[0][0] = this._level;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const growth = this._growth;
  let level = this._level;
  let counter = this._counter;
  let remain = inNumSamples;
  let j = 0;
  do {
    if (counter === 0) {
      const endLevel = this._endLevel;
      for (let i = 0; i < remain; i++) {
        out[j++] = endLevel;
      }
      remain = 0;
    } else {
      const nsmps = Math.min(remain, counter);
      counter -= nsmps;
      remain -= nsmps;
      for (let i = 0; i < nsmps; i++) {
        out[j++] = level;
        level *= growth;
      }
      if (counter === 0) {
        this.doneAction(this._doneAction);
      }
    }
  } while (remain);
  this._counter = counter;
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("XLine", SCUnitXLine);
module.exports = SCUnitXLine;
