"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitHPZ1 extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this._x1 = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  let x1 = this._x1;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = inIn[i];
    out[i] = 0.5 * (x0 - x1);
    x1 = x0;
  }
  this._x1 = x1;
};
SCUnitRepository.registerSCUnitClass("HPZ1", SCUnitHPZ1);
module.exports = SCUnitHPZ1;
