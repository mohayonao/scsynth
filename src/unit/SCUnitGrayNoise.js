"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitGrayNoise extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this._counter = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  let counter = this._counter;
  for (let i = 0; i < inNumSamples; i++) {
    counter ^= 1 << (Math.random() * 31 | 0);
    out[i] = counter * 4.65661287308e-10;
  }
  this._counter = counter;
};
SCUnitRepository.registerSCUnitClass("GrayNoise", SCUnitGrayNoise);
module.exports = SCUnitGrayNoise;
