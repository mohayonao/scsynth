"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const clamp = require("../util/clamp");
const sine = require("./_sine");
const gSine = sine.gSine;
const dspProcess = {};

class SCUnitBalance2 extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 4);
    assert(this.inputSpecs[0].rate === this.inputSpecs[1].rate);

    if (this.inputSpecs[2].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["aaak"];
    } else {
      this.dspProcess = dspProcess["aakk"];
    }

    let ipos;

    this._slopeFactor = rate.slopeFactor;
    this._pos = this.inputs[2][0];
    this._level = this.inputs[3][0];

    ipos = (1024 * this._pos + 1024 + 0.5)|0;
    ipos = clamp(ipos, 0, 2048);

    this._leftAmp = this._level * gSine[2048 - ipos];
    this._rightAmp = this._level * gSine[ipos];

    this.dspProcess(1);
  }
}

dspProcess["aaak"] = function(inNumSamples) {
  const leftOut = this.outputs[0];
  const rightOut = this.outputs[1];
  const leftIn = this.inputs[0];
  const rightIn = this.inputs[1];
  const posIn = this.inputs[2];
  const next_level = this.inputs[3][0];

  let level = this._level;
  let ipos;

  if (level !== next_level) {
    const level_slope = (next_level - level) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      ipos = (1024 * posIn[i] + 1024 + 0.5)|0;
      ipos = clamp(ipos, 0, 2048);

      const amp = level + level_slope * i;
      const leftAmp = amp * gSine[2048 - ipos];
      const rightAmp = amp * gSine[ipos];

      leftOut[i] = leftIn[i] * leftAmp;
      rightOut[i] = rightIn[i] * rightAmp;
    }

    this._level = next_level;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      ipos = (1024 * posIn[i] + 1024 + 0.5)|0;
      ipos = clamp(ipos, 0, 2048);

      leftOut[i] = leftIn[i] * level * gSine[2048 - ipos];
      rightOut[i] = rightIn[i] * level * gSine[ipos];
    }
  }
};

dspProcess["aakk"] = function(inNumSamples) {
  const leftOut = this.outputs[0];
  const rightOut = this.outputs[1];
  const leftIn = this.inputs[0];
  const rightIn = this.inputs[1];
  const next_pos = this.inputs[2][0];
  const next_level = this.inputs[3][0];
  const leftAmp = this._leftAmp;
  const rightAmp = this._rightAmp;

  let ipos;

  if (next_pos !== this._pos || next_level !== this._level) {
    ipos = (1024 * next_pos + 1024 + 0.5)|0;
    ipos = clamp(ipos, 0, 2048);

    const next_leftAmp = next_level * gSine[2048 - ipos];
    const next_rightAmp = next_level * gSine[ipos];
    const leftAmp_slope = (next_leftAmp - this._leftAmp) * this._slopeFactor;
    const rightAmp_slope = (next_rightAmp - this._rightAmp) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      leftOut[i] = leftIn[i] * (leftAmp + leftAmp_slope * i);
      rightOut[i] = rightIn[i] * (rightAmp + rightAmp_slope * i);
    }

    this._pos = next_pos;
    this._level = next_level;
    this._leftAmp = next_leftAmp;
    this._rightAmp = next_rightAmp;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      leftOut[i] = leftIn[i] * leftAmp;
      rightOut[i] = rightIn[i] * rightAmp;
    }
  }
};

SCUnitRepository.registerSCUnitClass("Balance2", SCUnitBalance2);

module.exports = SCUnitBalance2;
