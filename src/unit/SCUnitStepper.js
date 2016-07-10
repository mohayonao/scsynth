"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sc_wrap = require("../util/wrap");
const $r2k = [
  "i",
  "k",
  "a"
];
const dspProcess = {};
class SCUnitStepper extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess[$r2k[this.inputSpecs[1].rate]];
    this._prevtrig = 0;
    this._prevreset = 0;
    this._level = this.inputs[5][0];
    this.dspProcess(1);
  }
}
dspProcess["a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const resetIn = this.inputs[1];
  const zmin = this.inputs[2][0];
  const zmax = this.inputs[3][0];
  const step = this.inputs[4][0];
  const resetval = this.inputs[5][0];
  let prevtrig = this._prevtrig;
  let prevreset = this._prevreset;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    const curreset = resetIn[i];
    if (prevreset <= 0 && curreset > 0) {
      level = sc_wrap(resetval, zmin, zmax);
    } else if (prevtrig <= 0 && curtrig > 0) {
      level = sc_wrap(level + step, zmin, zmax);
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
  const zmin = this.inputs[2][0];
  const zmax = this.inputs[3][0];
  const step = this.inputs[4][0];
  const resetval = this.inputs[5][0];
  let prevtrig = this._prevtrig;
  let prevreset = this._prevreset;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    if (prevreset <= 0 && curreset > 0) {
      level = sc_wrap(resetval, zmin, zmax);
    } else if (prevtrig <= 0 && curtrig > 0) {
      level = sc_wrap(level + step, zmin, zmax);
    }
    out[i] = level;
    prevtrig = curtrig;
    prevreset = curreset;
  }
  this._level = level;
  this._prevtrig = prevtrig;
  this._prevreset = prevreset;
};
dspProcess["0"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const zmin = this.inputs[2][0];
  const zmax = this.inputs[3][0];
  const step = this.inputs[4][0];
  let prevtrig = this._prevtrig;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    if (prevtrig <= 0 && curtrig > 0) {
      level = sc_wrap(level + step, zmin, zmax);
    }
    out[i] = level;
    prevtrig = curtrig;
  }
  this._level = level;
  this._prevtrig = prevtrig;
};
SCUnitRepository.registerSCUnitClass("Stepper", SCUnitStepper);
module.exports = SCUnitStepper;
