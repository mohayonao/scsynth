"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const sine = require("./_sine");
const gSine = sine.gSine;
class SCUnitXFade2 extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[2].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_a"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    let ipos;
    this._slopeFactor = rate.slopeFactor;
    this._pos = this.inputs[2][0];
    this._level = this.inputs[3][0];
    ipos = 1024 * this._pos + 1024 + 0.5 | 0;
    ipos = Math.max(0, Math.min(ipos, 2048));
    this._leftAmp = this._level * gSine[2048 - ipos];
    this._rightAmp = this._level * gSine[ipos];
    this.dspProcess(1);
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const leftIn = this.inputs[0];
  const rightIn = this.inputs[1];
  const posIn = this.inputs[2];
  const nextLevel = this.inputs[3][0];
  const level = this._level;
  let ipos;
  if (level !== nextLevel) {
    const level_slope = (nextLevel - this._level) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      ipos = 1024 * posIn[i] + 1024 + 0.5 | 0;
      ipos = Math.max(0, Math.min(ipos, 2048));
      const amp = level + level_slope * i;
      const leftAmp = amp * gSine[2048 - ipos];
      const rightAmp = amp * gSine[ipos];
      out[i] = leftIn[i] * leftAmp + rightIn[i] * rightAmp;
    }
    this._level = nextLevel;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      ipos = 1024 * posIn[i] + 1024 + 0.5 | 0;
      ipos = Math.max(0, Math.min(ipos, 2048));
      const amp = level;
      const leftAmp = amp * gSine[2048 - ipos];
      const rightAmp = amp * gSine[ipos];
      out[i] = leftIn[i] * leftAmp + rightIn[i] * rightAmp;
    }
  }
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const leftIn = this.inputs[0];
  const rightIn = this.inputs[1];
  const nextPos = this.inputs[2][0];
  const nextLevel = this.inputs[3][0];
  const leftAmp = this._leftAmp;
  const rightAmp = this._rightAmp;
  let ipos;
  if (this._pos !== nextPos || this._level !== nextLevel) {
    ipos = 1024 * nextPos + 1024 + 0.5 | 0;
    ipos = Math.max(0, Math.min(ipos, 2048));
    const nextLeftAmp = nextLevel * gSine[2048 - ipos];
    const nextRightAmp = nextLevel * gSine[ipos];
    const slopeFactor = this._slopeFactor;
    const leftAmp_slope = (nextLeftAmp - leftAmp) * slopeFactor;
    const rightAmp_slope = (nextRightAmp - rightAmp) * slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = leftIn[i] * (leftAmp + leftAmp_slope * i) + rightIn[i] * (rightAmp + rightAmp_slope * i);
    }
    this._pos = nextPos;
    this._level = nextLevel;
    this._leftAmp = nextLeftAmp;
    this._rightAmp = nextRightAmp;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = leftIn[i] * leftAmp + rightIn[i] * rightAmp;
    }
  }
};
SCUnitRepository.registerSCUnitClass("XFade2", SCUnitXFade2);
module.exports = SCUnitXFade2;
