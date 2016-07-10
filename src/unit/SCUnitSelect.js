"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitSelect extends SCUnit {
  initialize() {
    if (this.bufferLength === 1) {
      this.dspProcess = dspProcess["next_1"];
    } else if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_a"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    this._maxIndex = this.inputs.length - 1;
    this.dspProcess(1);
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inputs = this.inputs;
  const whichIn = inputs[0];
  const maxIndex = this._maxIndex;
  for (let i = 0; i < inNumSamples; i++) {
    const index = Math.max(1, Math.min((whichIn[i] | 0) + 1, maxIndex));
    out[i] = inputs[index][i];
  }
};
dspProcess["next_k"] = function () {
  const index = Math.max(1, Math.min((this.inputs[0][0] | 0) + 1, this._maxIndex));
  this.outputs[0].set(this.inputs[index]);
};
dspProcess["next_1"] = function () {
  const index = Math.max(1, Math.min((this.inputs[0][0] | 0) + 1, this._maxIndex));
  this.outputs[0][0] = this.inputs[index][0];
};
SCUnitRepository.registerSCUnitClass("Select", SCUnitSelect);
module.exports = SCUnitSelect;
