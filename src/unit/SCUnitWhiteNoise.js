"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitWhiteNoise extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this.dspProcess(1);
  }
}

dspProcess["next"] = function(inNumSamples) {
  const out = this.outputs[0];

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = Math.random() * 2 - 1;
  }
};

SCUnitRepository.registerSCUnitClass("WhiteNoise", SCUnitWhiteNoise);

module.exports = SCUnitWhiteNoise;
