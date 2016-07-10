"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitToggleFF extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this._prevtrig = 0;
    this._level = 0;
    this.outputs[0][0] = 0;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  let prevtrig = this._prevtrig;
  let level = this._level;
  let curtrig;
  for (let i = 0; i < inNumSamples; i++) {
    curtrig = trigIn[i];
    if (prevtrig <= 0 && curtrig > 0) {
      level = 1 - level;
    }
    out[i] = level;
    prevtrig = curtrig;
  }
  this._prevtrig = prevtrig;
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("ToggleFF", SCUnitToggleFF);
module.exports = SCUnitToggleFF;
