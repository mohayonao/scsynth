"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitBRZ2 extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this._x1 = this.inputs[0][0];
    this._x2 = this.inputs[0][0];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  let x1 = this._x1;
  let x2 = this._x2;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = inIn[i];
    out[i] = (x0 + x2) * 0.25;
    x2 = x1;
    x1 = x0;
  }
  this._x1 = x1;
  this._x2 = x2;
};
SCUnitRepository.registerSCUnitClass("BRZ2", SCUnitBRZ2);
module.exports = SCUnitBRZ2;
