"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const toPowerOfTwo = require("../util/toPowerOfTwo");
const clamp = require("../util/clamp");
const dspProcess = {};
class SCUnitDelayN extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["k"];
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._maxdelaytime = this.inputs[1][0];
    this._delaytime = this.inputs[2][0];
    this._fdelaylen = toPowerOfTwo(this._maxdelaytime * this._sampleRate + 1 + this.bufferLength);
    this._fdelaylen = this._fdelaylen;
    this._idelaylen = this._fdelaylen;
    this._dlybuf = new Float32Array(this._fdelaylen);
    this._mask = this._fdelaylen - 1;
    this._dsamp = clamp(this, this._delaytime * this._sampleRate, 1, this._fdelaylen);
    this._numoutput = 0;
    this._iwrphase = 0;
  }
}
dspProcess["k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const delaytime = this.inputs[2][0];
  const mask = this._mask;
  const dlybuf = this._dlybuf;
  let iwrphase = this._iwrphase;
  let dsamp = this._dsamp;
  if (delaytime === this._delaytime) {
    for (let i = 0; i < inNumSamples; i++) {
      dlybuf[iwrphase & mask] = inIn[i];
      const irdphase = iwrphase - (dsamp | 0);
      out[i] = dlybuf[irdphase & mask];
      iwrphase += 1;
    }
  } else {
    const nextDsamp = clamp(this, delaytime * this._sampleRate, 1, this._fdelaylen);
    const dsampSlope = (nextDsamp - dsamp) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      dlybuf[iwrphase & mask] = inIn[i];
      dsamp += dsampSlope;
      const irdphase = iwrphase - (dsamp | 0);
      out[i] = dlybuf[irdphase & mask];
      iwrphase += 1;
    }
    this._dsamp = nextDsamp;
    this._delaytime = delaytime;
  }
  if (iwrphase > dlybuf.length) {
    iwrphase -= dlybuf.length;
  }
  this._iwrphase = iwrphase;
};
SCUnitRepository.registerSCUnitClass("DelayN", SCUnitDelayN);
module.exports = SCUnitDelayN;
