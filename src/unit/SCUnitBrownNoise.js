"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitBrownNoise extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];

    this._level = Math.random() * 2 - 1;

    this.outputs[0][0] = this._level;
  }
}

dspProcess["next"] = function(inNumSamples) {
  const out = this.outputs[0];

  let level = this._level;

  for (let i = 0; i < inNumSamples; i++) {
    level += Math.random() * 0.25 - 0.125;
    if (1 < level) {
      level = 2 - level;
    } else if (level < -1) {
      level = -2 - level;
    }
    out[i] = level;
  }

  this._level = level;
};

SCUnitRepository.registerSCUnitClass("BrownNoise", SCUnitBrownNoise);

module.exports = SCUnitBrownNoise;
