"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitInRange extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const loIn = this.inputs[1];
  const hiIn = this.inputs[2];
  for (let i = 0; i < inNumSamples; i++) {
    const _in = inIn[i];
    out[i] = loIn[i] <= _in && _in <= hiIn[i] ? 1 : 0;
  }
};
SCUnitRepository.registerSCUnitClass("InRange", SCUnitInRange);
module.exports = SCUnitInRange;
