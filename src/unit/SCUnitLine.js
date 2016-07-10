"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLine extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    let start = this.inputs[0][0];
    let end = this.inputs[1][0];
    let dur = this.inputs[2][0];
    let counter = Math.round(dur * rate.sampleRate);
    this._counter = Math.max(1, counter);
    if (counter === 0) {
      this._level = end;
      this._slope = 0;
    } else {
      this._slope = (end - start) / this._counter;
      this._level = start + this._slope;
    }
    this._endLevel = end;
    this._doneAction = this.inputs[3][0];
    this.outputs[0][0] = this._level;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const slope = this._slope;
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
        level += slope;
      }
      if (counter === 0) {
        this.doneAction(this._doneAction);
      }
    }
  } while (remain);
  this._counter = counter;
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("Line", SCUnitLine);
module.exports = SCUnitLine;
