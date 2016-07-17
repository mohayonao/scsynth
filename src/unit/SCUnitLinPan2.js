"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const clamp = require("../util/clamp");

const dspProcess = {};

class SCUnitLinPan2 extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 3);

    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["aak"];
    } else {
      this.dspProcess = dspProcess["akk"];
    }

    this._slopeFactor = rate.slopeFactor;
    this._level = this.inputs[2][0];
    this._pan = clamp(this.inputs[1][0] * 0.5 + 0.5, 0, 1);
    this._rightAmp = this._level * this._pan;
    this._leftAmp = this._level * (1 - this._pan);

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

  let pan;

  if (level !== next_level) {
    const level_slope = (next_level - level) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      pan = clamp(posIn[i] * 0.5 + 0.5, 0, 1);

      const amp = level + level_slope * i;
      const rightAmp = amp * pan;
      const leftAmp = amp * (1 - pan);

      leftOut[i] = inIn[i] * leftAmp;
      rightOut[i] = inIn[i] * rightAmp;
    }

    this._level = next_level;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      pan = clamp(posIn[i] * 0.5 + 0.5, 0, 1);
      leftOut[i] = inIn[i] * (level * (1 - pan));
      rightOut[i] = inIn[i] * (level * pan);
    }
  }
};

dspProcess["akk"] = function(inNumSamples) {
  const leftOut = this.outputs[0];
  const rightOut = this.outputs[1];
  const inIn = this.inputs[0];
  const next_pan = clamp(this.inputs[1][0] * 0.5 + 0.5, 0, 1);
  const next_level = this.inputs[2][0];
  const leftAmp = this._leftAmp;
  const rightAmp = this._rightAmp;

  if (this._pan !== next_pan || this._level !== next_level) {
    const next_rightAmp = next_level * next_pan;
    const next_leftAmp = next_level * (1 - next_pan);
    const leftAmp_slope = (next_leftAmp - leftAmp) * this._slopeFactor;
    const rightAmp_slope = (next_rightAmp - rightAmp) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      leftOut[i] = inIn[i] * (leftAmp + leftAmp_slope * i);
      rightOut[i] = inIn[i] * (rightAmp + rightAmp_slope * i);
    }

    this._pan = next_pan;
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

SCUnitRepository.registerSCUnitClass("LinPan2", SCUnitLinPan2);

module.exports = SCUnitLinPan2;
