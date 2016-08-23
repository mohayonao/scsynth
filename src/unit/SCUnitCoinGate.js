"use strict";

const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitCoinGate extends SCUnit {
  initialize() {
    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["ka"];
    } else {
      this.dspProcess = dspProcess["kk"];
    }

    this._trig = this.inputs[1][0];
  }
}

dspProcess["ka"] = function(inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[1];
  const prob = this.inputs[0][0];

  let trig = this._trig;

  for (let i = 0; i < inNumSamples; i++) {
    const trig_next = trigIn[i];

    let value = 0;

    if (trig <= 0 && 0 < trig_next) {
      if (Math.random() < prob) {
        value = trig_next;
      }
    }

    out[i] = value;
    trig = trig_next;
  }

  this._trig = trig;
};

dspProcess["kk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const trig_next = this.inputs[1][0];
  const trig = this._trig;

  let value = 0;

  if (trig <= 0 && 0 < trig_next) {
    if (Math.random() < this.inputs[0][0]) {
      value = trig_next;
    }
  }

  out[0] = value;

  for (let i = 1; i < inNumSamples; i++) {
    out[i] = 0;
  }

  this._trig = trig_next;
};

SCUnitRepository.registerSCUnitClass("CoinGate", SCUnitCoinGate);

module.exports = SCUnitCoinGate;
