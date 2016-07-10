"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitPulseDivider extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this._prevtrig = 0;
    this._level = 0;
    this._counter = Math.floor(this.inputs[2][0] + 0.5);
    this.outputs[0][0] = 0;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const div = this.inputs[1][0] | 0;
  let prevtrig = this._prevtrig;
  let counter = this._counter;
  let z;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    if (prevtrig <= 0 && curtrig > 0) {
      counter += 1;
      if (counter >= div) {
        counter = 0;
        z = 1;
      } else {
        z = 0;
      }
    } else {
      z = 0;
    }
    out[i] = z;
    prevtrig = curtrig;
  }
  this._counter = counter;
  this._prevtrig = prevtrig;
};
SCUnitRepository.registerSCUnitClass("PulseDivider", SCUnitPulseDivider);
module.exports = SCUnitPulseDivider;
