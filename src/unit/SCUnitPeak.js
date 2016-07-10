"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const $r2k = [
  "i",
  "k",
  "a"
];
class SCUnitPeak extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess[$r2k[this.inputSpecs[1].rate]];
    this._prevtrig = 0;
    this._level = this.inputs[0][0];
    this.outputs[0][0] = this._level;
  }
}
dspProcess["a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const trigIn = this.inputs[1];
  let prevtrig = this._prevtrig;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    const inlevel = Math.abs(inIn[i]);
    out[i] = level = Math.max(inlevel, level);
    if (prevtrig <= 0 && curtrig > 0) {
      level = inlevel;
    }
    prevtrig = curtrig;
  }
  this._prevtrig = prevtrig;
  this._level = level;
};
dspProcess["k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const curtrig = this.inputs[1][0];
  let prevtrig = this._prevtrig;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const inlevel = Math.abs(inIn[i]);
    out[i] = level = Math.max(inlevel, level);
    if (prevtrig <= 0 && curtrig > 0) {
      level = inlevel;
    }
    prevtrig = curtrig;
  }
  this._prevtrig = prevtrig;
  this._level = level;
};
dspProcess["i"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const inlevel = Math.abs(inIn[i]);
    out[i] = level = Math.max(inlevel, level);
  }
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("Peak", SCUnitPeak);
module.exports = SCUnitPeak;
