"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitTrigControl extends SCUnit {
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
  const controls = this._controls;
  const specialIndex = this.specialIndex;
  this.outputs[0][0] = controls[specialIndex];
  controls[specialIndex] = 0;
};
dspProcess["k"] = function () {
  const controls = this._controls;
  const outputs = this.outputs;
  const numberOfChannels = outputs.length;
  const specialIndex = this.specialIndex;
  for (let i = 0; i < numberOfChannels; i++) {
    outputs[i][0] = controls[specialIndex + i];
    controls[specialIndex + i] = 0;
  }
};
SCUnitRepository.registerSCUnitClass("TrigControl", SCUnitTrigControl);
module.exports = SCUnitTrigControl;
