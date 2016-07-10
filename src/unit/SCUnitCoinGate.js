"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitCoinGate extends SCUnit {
  initialize() {
    if (this.calcRate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    this._trig = this.inputs[1][0];
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[1];
  const prob = this.inputs[0][0];
  let prevTrig = this._trig;
  for (let i = 0; i < inNumSamples; i++) {
    const curTrig = trigIn[i];
    let level = 0;
    if (prevTrig <= 0 && curTrig > 0) {
      if (Math.random() < prob) {
        level = curTrig;
      }
    }
    prevTrig = curTrig;
    out[i] = level;
  }
  this._trig = prevTrig;
};
dspProcess["next_k"] = function () {
  const trig = this.inputs[1][0];
  let level = 0;
  if (trig > 0 && this._trig <= 0) {
    if (Math.random() < this.inputs[0][0]) {
      level = trig;
    }
  }
  this.outputs[0][0] = level;
  this._trig = trig;
};
SCUnitRepository.registerSCUnitClass("CoinGate", SCUnitCoinGate);
module.exports = SCUnitCoinGate;
