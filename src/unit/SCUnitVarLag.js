"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");
const dspProcess = {};
class SCUnitVarLag extends SCUnit {
  initialize(rate) {
    if (this.bufferLength === 1) {
      this.dspProcess = dspProcess["next_1"];
    } else {
      this.dspProcess = dspProcess["next"];
    }
    this._sampleRate = rate.sampleRate;
    const lagTime = this.inputs[1][0];
    const counter = Math.max(1, lagTime * rate.sampleRate | 0);
    this._level = this.inputs[2][0];
    this._counter = counter;
    this._in = this.inputs[0][0];
    this._slope = (this._in - this._level) / counter;
    this._lagTime = lagTime;
    this.outputs[0][0] = this._level;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const lagTime = this.inputs[1][0];
  let _in = this.inputs[0][0];
  let slope = this._slope;
  let level = this._level;
  let counter = this._counter;
  if (_in !== this._in) {
    this._counter = counter = Math.max(1, lagTime * this._sampleRate | 0);
    this._slope = slope = (_in - this._in) / counter;
    this._in = _in;
    this._lagTime = lagTime;
  } else if (lagTime !== this._lagTime) {
    const scaleFactor = lagTime / this._lagTime;
    this._counter = counter = Math.max(1, this._counter * scaleFactor | 0);
    this._slope = slope = this._slope / scaleFactor || 0;
    this._lagTime = lagTime;
  }
  _in = this._in;
  if (counter > 0) {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = level;
      if (counter > 0) {
        level += slope;
        counter -= 1;
      } else {
        level = _in;
      }
    }
  } else {
    fill(out, level);
  }
  this._level = level;
  this._slope = slope;
  this._counter = counter;
};
dspProcess["next_1"] = function () {
  const _in = this.inputs[0][0];
  const lagTime = this.inputs[1][0];
  let counter = this._counter;
  if (_in !== this._in) {
    this._counter = counter = Math.max(1, lagTime * this._sampleRate | 0);
    this._slope = (_in - this._level) / counter;
    this._in = _in;
    this._lagTime = lagTime;
  } else if (lagTime !== this._lagTime) {
    if (counter !== 0) {
      const scaleFactor = lagTime / this._lagTime;
      this._counter = counter = Math.max(1, this._counter * scaleFactor | 0);
      this._slope = this._slope / scaleFactor;
    }
    this._lagTime = lagTime;
  }
  this.outputs[0][0] = this._level;
  if (this._counter > 0) {
    this._level += this._slope;
    this._counter -= 1;
  } else {
    this._level = this._in;
  }
};
SCUnitRepository.registerSCUnitClass("VarLag", SCUnitVarLag);
module.exports = SCUnitVarLag;
