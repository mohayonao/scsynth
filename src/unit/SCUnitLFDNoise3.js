"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sc_cubicinterp = require("../util/sc_cubicinterp");
const dspProcess = {};
class SCUnitLFDNoise3 extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    this._sampleDur = rate.sampleDur;
    this._phase = 0;
    this._levelA = 0;
    this._levelB = 0;
    this._levelC = 0;
    this._levelD = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const smpdur = this._sampleDur;
  let a = this._levelA;
  let b = this._levelB;
  let c = this._levelC;
  let d = this._levelD;
  let phase = this._phase;
  for (let i = 0; i < inNumSamples; i++) {
    phase -= freqIn[i] * smpdur;
    if (phase < 0) {
      phase = 1 + phase % 1;
      a = b;
      b = c;
      c = d;
      d = Math.random() * 2 - 1;
    }
    out[i] = sc_cubicinterp(1 - phase, a, b, c, d);
  }
  this._levelA = a;
  this._levelB = b;
  this._levelC = c;
  this._levelD = d;
  this._phase = phase;
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0];
  const smpdur = this._sampleDur;
  const dphase = freq * smpdur;
  let a = this._levelA;
  let b = this._levelB;
  let c = this._levelC;
  let d = this._levelD;
  let phase = this._phase;
  for (let i = 0; i < inNumSamples; i++) {
    phase -= dphase;
    if (phase < 0) {
      phase = 1 + phase % 1;
      a = b;
      b = c;
      c = d;
      d = Math.random() * 2 - 1;
    }
    out[i] = sc_cubicinterp(1 - phase, a, b, c, d);
  }
  this._levelA = a;
  this._levelB = b;
  this._levelC = c;
  this._levelD = d;
  this._phase = phase;
};
SCUnitRepository.registerSCUnitClass("LFDNoise3", SCUnitLFDNoise3);
module.exports = SCUnitLFDNoise3;
