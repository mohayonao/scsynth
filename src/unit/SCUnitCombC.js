"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const delay = require("./_delay");
const toPowerOfTwo = require("../util/toPowerOfTwo");
const cubicinterp = require("../util/cubicinterp");
const clamp = require("../util/clamp");
const dspProcess = {};
class SCUnitCombC extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["kk"];
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._maxdelaytime = this.inputs[1][0];
    this._delaytime = this.inputs[2][0];
    this._decaytime = this.inputs[3][0];
    this._fdelaylen = toPowerOfTwo(this._maxdelaytime * this._sampleRate + 1 + this.bufferLength);
    this._idelaylen = this._fdelaylen;
    this._dlybuf = new Float32Array(this._fdelaylen);
    this._mask = this._fdelaylen - 1;
    this._dsamp = clamp(this._delaytime * this._sampleRate, 1, this._fdelaylen);
    this._iwrphase = 0;
    this._feedbk = delay.feedback(this._delaytime, this._decaytime);
  }
}
dspProcess["kk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const delaytime = this.inputs[2][0];
  const decaytime = this.inputs[3][0];
  const dlybuf = this._dlybuf;
  const mask = this._mask;
  const frac = dsamp - (dsamp | 0);
  let dsamp = this._dsamp;
  let feedbk = this._feedbk;
  let iwrphase = this._iwrphase;
  let irdphase;
  if (delaytime === this._delaytime) {
    irdphase = iwrphase - (dsamp | 0);
    if (decaytime === this._decaytime) {
      for (let i = 0; i < inNumSamples; i++) {
        const d0 = dlybuf[irdphase + 1 & mask];
        const d1 = dlybuf[irdphase & mask];
        const d2 = dlybuf[irdphase - 1 & mask];
        const d3 = dlybuf[irdphase - 2 & mask];
        const value = cubicinterp(frac, d0, d1, d2, d3) || 0;
        dlybuf[iwrphase & mask] = inIn[i] + feedbk * value || 0;
        out[i] = value;
        irdphase++;
        iwrphase++;
      }
    } else {
      const nextFeedbk = delay.feedback(delaytime, decaytime);
      const feedbkSlope = (nextFeedbk - feedbk) * this._slopeFactor;
      for (let i = 0; i < inNumSamples; i++) {
        const d0 = dlybuf[irdphase + 1 & mask];
        const d1 = dlybuf[irdphase & mask];
        const d2 = dlybuf[irdphase - 1 & mask];
        const d3 = dlybuf[irdphase - 2 & mask];
        const value = cubicinterp(frac, d0, d1, d2, d3) || 0;
        dlybuf[iwrphase & mask] = inIn[i] + feedbk * value || 0;
        out[i] = value;
        feedbk += feedbkSlope;
        irdphase++;
        iwrphase++;
      }
      this._feedbk = nextFeedbk;
      this._decaytime = decaytime;
    }
  } else {
    const nextDsamp = clamp(this, delaytime * this._sampleRate, 1, this._fdelaylen);
    const dsampSlope = (nextDsamp - dsamp) * this._slopeFactor;
    const nextFeedbk = delay.feedback(delaytime, decaytime);
    const feedbkSlope = (nextFeedbk - feedbk) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      irdphase = iwrphase - (dsamp | 0);
      const d0 = dlybuf[irdphase + 1 & mask];
      const d1 = dlybuf[irdphase & mask];
      const d2 = dlybuf[irdphase - 1 & mask];
      const d3 = dlybuf[irdphase - 2 & mask];
      const value = cubicinterp(frac, d0, d1, d2, d3) || 0;
      dlybuf[iwrphase & mask] = inIn[i] + feedbk * value || 0;
      out[i] = value;
      dsamp += dsampSlope;
      feedbk += feedbkSlope;
      irdphase++;
      iwrphase++;
    }
    this._feedbk = feedbk;
    this._dsamp = dsamp;
    this._delaytime = delaytime;
    this._decaytime = decaytime;
  }
  this._iwrphase = iwrphase;
};
SCUnitRepository.registerSCUnitClass("CombC", SCUnitCombC);
module.exports = SCUnitCombC;
