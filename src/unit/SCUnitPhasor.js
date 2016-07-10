"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sc_wrap = require("../util/wrap");
const dspProcess = {};
class SCUnitPhasor extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this._prevtrig = this.inputs[0][0];
    this.outputs[0][0] = this._level = this.inputs[2][0];
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const rate = this.inputs[1][0];
  const start = this.inputs[2][0];
  const end = this.inputs[3][0];
  const resetPos = this.inputs[4][0];
  let prevtrig = this._prevtrig;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];
    if (prevtrig <= 0 && curtrig > 0) {
      const frac = 1 - prevtrig / (curtrig - prevtrig);
      level = resetPos + frac * rate;
    }
    out[i] = level;
    level += rate;
    level = sc_wrap(level, start, end);
    prevtrig = curtrig;
  }
  this._prevtrig = prevtrig;
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("Phasor", SCUnitPhasor);
module.exports = SCUnitPhasor;
