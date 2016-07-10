"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLFDNoise1 extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    this._sampleDur = rate.sampleDur;
    this._phase = 0;
    this._prevLevel = 0;
    this._nextLevel = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const smpdur = this._sampleDur;
  let prevLevel = this._prevLevel;
  let nextLevel = this._nextLevel;
  let phase = this._phase;
  for (let i = 0; i < inNumSamples; i++) {
    phase -= freqIn[i] * smpdur;
    if (phase < 0) {
      phase = 1 + phase % 1;
      prevLevel = nextLevel;
      nextLevel = Math.random() * 2 - 1;
    }
    out[i] = nextLevel + phase * (prevLevel - nextLevel);
  }
  this._prevLevel = prevLevel;
  this._nextLevel = nextLevel;
  this._phase = phase;
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0];
  const smpdur = this._sampleDur;
  const dphase = freq * smpdur;
  let prevLevel = this._prevLevel;
  let nextLevel = this._nextLevel;
  let phase = this._phase;
  for (let i = 0; i < inNumSamples; i++) {
    phase -= dphase;
    if (phase < 0) {
      phase = 1 + phase % 1;
      prevLevel = nextLevel;
      nextLevel = Math.random() * 2 - 1;
    }
    out[i] = nextLevel + phase * (prevLevel - nextLevel);
  }
  this._prevLevel = prevLevel;
  this._nextLevel = nextLevel;
  this._phase = phase;
};
SCUnitRepository.registerSCUnitClass("LFDNoise1", SCUnitLFDNoise1);
module.exports = SCUnitLFDNoise1;
