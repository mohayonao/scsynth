"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitSlew extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleDur = rate.sampleDur;
    this._level = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const upf = +this.inputs[1][0] * this._sampleDur;
  const dnf = -this.inputs[2][0] * this._sampleDur;
  let level = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    const slope = inIn[i] - level;
    level += Math.max(dnf, Math.min(slope, upf));
    out[i] = level;
  }
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("Slew", SCUnitSlew);
module.exports = SCUnitSlew;
