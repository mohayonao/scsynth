"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitSetResetFF extends SCUnit {
  initialize() {
    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_a"];
    } else {
      this.dspProcess = dspProcess["next"];
    }
    this._prevtrig = 0;
    this._prevreset = 0;
    this._level = 0;
    this.outputs[0][0] = 0;
  }
}
dspProcess["next_a"] = function (inNumSamples) {
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
      level = 1;
    }
    out[i] = level;
    prevtrig = curtrig;
    prevreset = curreset;
  }
  this._level = level;
  this._prevtrig = prevtrig;
  this._prevreset = prevreset;
};
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const resetIn = this.inputs[1];
  let prevtrig = this._prevtrig;
  let prevreset = this._prevreset;
  let level = this._level;
  let curtrig, curreset;
  curtrig = trigIn[0];
  curreset = resetIn[0];
  if (prevreset <= 0 && curreset > 0) {
    level = 0;
  } else if (prevtrig <= 0 && curtrig > 0) {
    level = 1;
  }
  out[0] = level;
  prevtrig = curtrig;
  prevreset = curreset;
  for (let i = 1; i < inNumSamples; i++) {
    curtrig = trigIn[i];
    if (prevtrig <= 0 && curtrig > 0) {
      level = 1;
    }
    out[i] = level;
    prevtrig = curtrig;
  }
  this._level = level;
  this._prevtrig = prevtrig;
  this._prevreset = prevreset;
};
SCUnitRepository.registerSCUnitClass("SetResetFF", SCUnitSetResetFF);
module.exports = SCUnitSetResetFF;
