"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const MAX_KEY = 31;
class SCUnitPinkNoise extends SCUnit {
  initialize() {
    const whites = new Uint8Array(5);
    for (let i = 0; i < 5; i++) {
      whites[i] = (Math.random() * 1073741824 | 0) % 25;
    }
    this.dspProcess = dspProcess["next"];
    this._whites = whites;
    this._key = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const whites = this._whites;
  let key = this._key | 0;
  for (let i = 0; i < inNumSamples; i++) {
    const last_key = key++;
    if (key > MAX_KEY) {
      key = 0;
    }
    const diff = last_key ^ key;
    let sum = 0;
    for (let j = 0; j < 5; j++) {
      if (diff & 1 << j) {
        whites[j] = (Math.random() * 1073741824 | 0) % 25;
      }
      sum += whites[j];
    }
    out[i] = sum * 0.01666666 - 1;
  }
  this._key = key;
};
SCUnitRepository.registerSCUnitClass("PinkNoise", SCUnitPinkNoise);
module.exports = SCUnitPinkNoise;
