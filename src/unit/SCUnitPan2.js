"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const sine = require("./_sine");
const gSine = sine.gSine;
class SCUnitPan2 extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_a"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    this._slopeFactor = rate.slopeFactor;
    this._pos = this.inputs[1][0];
    this._level = this.inputs[2][0];
    let ipos = 1024 * this._pos + 1024 + 0.5 | 0;
    ipos = Math.max(0, Math.min(ipos, 2048));
    this._leftAmp = this._level * gSine[2048 - ipos];
    this._rightAmp = this._level * gSine[ipos];
    this.dspProcess(1);
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const leftOut = this.outputs[0];
  const rightOut = this.outputs[1];
  const inIn = this.inputs[0];
  const posIn = this.inputs[1];
  const nextLevel = this.inputs[2][0];
  const level = this._level;
  let ipos;
  if (level !== nextLevel) {
    let level_slope = (nextLevel - level) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const _in = inIn[i];
      ipos = 1024 * posIn[i] + 1024 + 0.5 | 0;
      ipos = Math.max(0, Math.min(ipos, 2048));
      const amp = level + level_slope * i;
      const leftAmp = amp * gSine[2048 - ipos];
      const rightAmp = amp * gSine[ipos];
      leftOut[i] = _in * leftAmp;
      rightOut[i] = _in * rightAmp;
    }
    this._level = nextLevel;
  } else {
    const amp = level;
    for (let i = 0; i < inNumSamples; i++) {
      const _in = inIn[i];
      ipos = 1024 * posIn[i] + 1024 + 0.5 | 0;
      ipos = Math.max(0, Math.min(ipos, 2048));
      const leftAmp = amp * gSine[2048 - ipos];
      const rightAmp = amp * gSine[ipos];
      leftOut[i] = _in * leftAmp;
      rightOut[i] = _in * rightAmp;
    }
  }
};
dspProcess["next_k"] = function (inNumSamples) {
  const leftOut = this.outputs[0];
  const rightOut = this.outputs[1];
  const inIn = this.inputs[0];
  const nextPos = this.inputs[1][0];
  const nextLevel = this.inputs[2][0];
  const leftAmp = this._leftAmp;
  const rightAmp = this._rightAmp;
  let ipos;
  if (this._pos !== nextPos || this._level !== nextLevel) {
    ipos = 1024 * nextPos + 1024 + 0.5 | 0;
    ipos = Math.max(0, Math.min(ipos, 2048));
    const nextLeftAmp = nextLevel * gSine[2048 - ipos];
    const nextRightAmp = nextLevel * gSine[ipos];
    const leftAmp_slope = (nextLeftAmp - leftAmp) * this._slopeFactor;
    const rightAmp_slope = (nextRightAmp - rightAmp) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      const _in = inIn[i];
      leftOut[i] = _in * (leftAmp + leftAmp_slope * i);
      rightOut[i] = _in * (rightAmp + rightAmp_slope * i);
    }
    this._pos = nextPos;
    this._level = nextLevel;
    this._leftAmp = nextLeftAmp;
    this._rightAmp = nextRightAmp;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      const _in = inIn[i];
      leftOut[i] = _in * leftAmp;
      rightOut[i] = _in * rightAmp;
    }
  }
};
SCUnitRepository.registerSCUnitClass("Pan2", SCUnitPan2);
module.exports = SCUnitPan2;
