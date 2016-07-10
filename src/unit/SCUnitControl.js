"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitControl extends SCUnit {
  initialize() {
    if (this.outputs.length === 1) {
      this.dspProcess = dspProcess["1"];
    } else {
      this.dspProcess = dspProcess["k"];
    }
    this._controls = this.synth.params;
    this.dspProcess(1);
  }
}
dspProcess["1"] = function () {
  this.outputs[0][0] = this._controls[this.specialIndex];
};
dspProcess["k"] = function () {
  const controls = this._controls;
  const outputs = this.outputs;
  const numerOfOutputs = outputs.length;
  const specialIndex = this.specialIndex;
  for (let i = 0; i < numerOfOutputs; i++) {
    outputs[i][0] = controls[specialIndex + i];
  }
};
SCUnitRepository.registerSCUnitClass("Control", SCUnitControl);
module.exports = SCUnitControl;
