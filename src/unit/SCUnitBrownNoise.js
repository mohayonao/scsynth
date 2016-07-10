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
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  let z = this._level;
  for (let i = 0; i < inNumSamples; i++) {
    z += Math.random() * 0.25 - 0.125;
    if (z > 1) {
      z = 2 - z;
    } else if (z < -1) {
      z = -2 - z;
    }
    out[i] = z;
  }
  this._level = z;
};
SCUnitRepository.registerSCUnitClass("BrownNoise", SCUnitBrownNoise);
module.exports = SCUnitBrownNoise;
