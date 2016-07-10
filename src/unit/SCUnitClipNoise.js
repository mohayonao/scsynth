"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitClipNoise extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = Math.random() < 0.5 ? -1 : +1;
  }
};
SCUnitRepository.registerSCUnitClass("ClipNoise", SCUnitClipNoise);
module.exports = SCUnitClipNoise;
