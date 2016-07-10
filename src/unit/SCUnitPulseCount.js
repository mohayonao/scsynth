"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const $r2k = [
  "i",
  "k",
  "a"
];
class SCUnitPulseCount extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess[$r2k[this.inputSpecs[1].rate]];
    this._prevtrig = 0;
    this._prevreset = 0;
    this._level = 0;
    this.outputs[0][0] = 0;
  }
}
dspProcess["a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const resetIn = this.inputs[1];
  let prevtrig = this._prevtrig;
  let prevreset = this._prevreset;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    const curreset = resetIn[i];
    if (prevreset <= 0 && curreset > 0) {
      level = 0;
    } else if (prevtrig <= 0 && curtrig > 0) {
      level += 1;
    }
    out[i] = level;
    prevtrig = curtrig;
    prevreset = curreset;
  }
  this._level = level;
  this._prevtrig = prevtrig;
  this._prevreset = prevreset;
};
dspProcess["k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const curreset = this.inputs[1][0];
  let prevtrig = this._prevtrig;
  let prevreset = this._prevreset;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    if (prevreset <= 0 && curreset > 0) {
      level = 0;
    } else if (prevtrig <= 0 && curtrig > 0) {
      level += 1;
    }
    out[i] = level;
    prevtrig = curtrig;
    prevreset = curreset;
  }
  this._level = level;
  this._prevtrig = prevtrig;
  this._prevreset = prevreset;
};
dspProcess["i"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  let prevtrig = this._prevtrig;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    if (prevtrig <= 0 && curtrig > 0) {
      level += 1;
    }
    out[i] = level;
    prevtrig = curtrig;
  }
  this._level = level;
  this._prevtrig = prevtrig;
};
SCUnitRepository.registerSCUnitClass("PulseCount", SCUnitPulseCount);
module.exports = SCUnitPulseCount;
