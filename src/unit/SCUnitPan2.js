"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const clamp = require("../util/clamp");
const sine = require("./_sine");

const gSine = sine.gSine;
const dspProcess = {};

class SCUnitPan2 extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 3);

    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["aak"];
    } else {
      this.dspProcess = dspProcess["akk"];
    }

    let ipos;

    this._slopeFactor = rate.slopeFactor;
    this._pos = this.inputs[1][0];
    this._level = this.inputs[2][0];

    ipos = (1024 * this._pos + 1024 + 0.5)|0;
    ipos = clamp(ipos, 0, 2048);

    this._leftAmp = this._level * gSine[2048 - ipos];
    this._rightAmp = this._level * gSine[ipos];

    this.dspProcess(1);
  }
}

dspProcess["aak"] = function(inNumSamples) {
  const leftOut = this.outputs[0];
  const rightOut = this.outputs[1];
  const inIn = this.inputs[0];
  const posIn = this.inputs[1];
  const level = this._level;
  const next_level = this.inputs[2][0];

  let ipos;

  if (level !== next_level) {
    const level_slope = (next_level - level) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      ipos = (1024 * posIn[i] + 1024 + 0.5)|0;
      ipos = clamp(ipos, 0, 2048);

      const amp = level + level_slope * i;
      const leftAmp = amp * gSine[2048 - ipos];
      const rightAmp = amp * gSine[ipos];

      leftOut[i] = inIn[i] * leftAmp;
      rightOut[i] = inIn[i] * rightAmp;
    }

    this._level = next_level;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      ipos = (1024 * posIn[i] + 1024 + 0.5)|0;
      ipos = clamp(ipos, 0, 2048);
      leftOut[i] = inIn[i] * level * gSine[2048 - ipos];
      rightOut[i] = inIn[i] * level * gSine[ipos];
    }
  }
};

dspProcess["akk"] = function(inNumSamples) {
  const leftOut = this.outputs[0];
  const rightOut = this.outputs[1];
  const inIn = this.inputs[0];
  const next_pos = this.inputs[1][0];
  const next_level = this.inputs[2][0];
  const leftAmp = this._leftAmp;
  const rightAmp = this._rightAmp;

  let ipos;

  if (this._pos !== next_pos || this._level !== next_level) {
    ipos = (1024 * next_pos + 1024 + 0.5)|0;
    ipos = clamp(ipos, 0, 2048);

    const next_leftAmp = next_level * gSine[2048 - ipos];
    const next_rightAmp = next_level * gSine[ipos];
    const leftAmp_slope = (next_leftAmp - leftAmp) * this._slopeFactor;
    const rightAmp_slope = (next_rightAmp - rightAmp) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      leftOut[i] = inIn[i] * (leftAmp + leftAmp_slope * i);
      rightOut[i] = inIn[i] * (rightAmp + rightAmp_slope * i);
    }

    this._pos = next_pos;
    this._level = next_level;
    this._leftAmp = next_leftAmp;
    this._rightAmp = next_rightAmp;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      leftOut[i] = inIn[i] * leftAmp;
      rightOut[i] = inIn[i] * rightAmp;
    }
  }
};

SCUnitRepository.registerSCUnitClass("Pan2", SCUnitPan2);

module.exports = SCUnitPan2;
