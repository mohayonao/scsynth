"use strict";

const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");
const dspProcess = {};

class SCUnitLatch extends SCUnit {
  initialize() {
    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["aa"];
    } else {
      this.dspProcess = dspProcess["ak"];
    }
    const level = this.inputs[0][0];
    const trig = this.inputs[1][0];

    this._trig = 0;
    this._level = 0;

    this.outputs[0][0] = 0 < trig ? level : 0;
  }
}

dspProcess["aa"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const trigIn = this.inputs[1];

  let trig = this._trig;
  let level = this._level;

  for (let i = 0; i < inNumSamples; i++) {
    const curtrig = trigIn[i];

    if (trig <= 0 && 0 < curtrig) {
      level = inIn[i];
    }

    out[i] = level;
    trig = curtrig;
  }

  this._trig = trig;
  this._level = level;
};

dspProcess["ak"] = function() {
  const out = this.outputs[0];
  const trig = this.inputs[1][0];

  let level = this._level;

  if (this._trig <= 0 && 0 < trig) {
    level = this.inputs[0][0];
  }

  fill(out, level);

  this._trig = trig;
  this._level = level;
};

SCUnitRepository.registerSCUnitClass("Latch", SCUnitLatch);

module.exports = SCUnitLatch;
