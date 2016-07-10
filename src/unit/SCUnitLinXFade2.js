"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLinXFade2 extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[2].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_a"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    this._slopeFactor = rate.slopeFactor;
    this._pos = Math.max(-1, Math.min(this.inputs[2][0], 1));
    this._amp = this._pos * 0.5 + 0.5;
    this.dspProcess(1);
  }
}
dspProcess["next_a"] = function (inNumSamples) {
  const out = this.outputs[0];
  const leftIn = this.inputs[0];
  const rightIn = this.inputs[1];
  const posIn = this.inputs[2];
  for (let i = 0; i < inNumSamples; i++) {
    const pos = Math.max(-1, Math.min(posIn[i], 1));
    const amp = pos * 0.5 + 0.5;
    out[i] = leftIn[i] + amp * (rightIn[i] - leftIn[i]);
  }
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const leftIn = this.inputs[0];
  const rightIn = this.inputs[1];
  const nextPos = this.inputs[2][0];
  const amp = this._amp;
  if (this._pos !== nextPos) {
    const pos = Math.max(-1, Math.min(nextPos, 1));
    const nextAmp = pos * 0.5 + 0.5;
    const amp_slope = (nextAmp - amp) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = leftIn[i] + (amp + amp_slope * i) * (rightIn[i] - leftIn[i]);
    }
    this._pos = nextPos;
    this._amp = nextAmp;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = leftIn[i] + amp * (rightIn[i] - leftIn[i]);
    }
  }
};
SCUnitRepository.registerSCUnitClass("LinXFade2", SCUnitLinXFade2);
module.exports = SCUnitLinXFade2;
