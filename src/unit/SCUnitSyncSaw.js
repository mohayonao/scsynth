"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitSyncSaw extends SCUnit {
  initialize(rate) {
    if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
      if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
        this.dspProcess = dspProcess["next_aa"];
      } else {
        this.dspProcess = dspProcess["next_ak"];
      }
    } else {
      if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
        this.dspProcess = dspProcess["next_ka"];
      } else {
        this.dspProcess = dspProcess["next_kk"];
      }
    }
    this._freqMul = 2 * rate.sampleDur;
    this._phase1 = 0;
    this._phase2 = 0;
    this.dspProcess(1);
  }
}
dspProcess["next_aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq1In = this.inputs[0];
  const freq2In = this.inputs[1];
  const freqMul = this._freqMul;
  let phase1 = this._phase1;
  let phase2 = this._phase2;
  for (let i = 0; i < inNumSamples; i++) {
    const z = phase2;
    const freq1x = freq1In[i] * freqMul;
    const freq2x = freq2In[i] * freqMul;
    phase2 += freq2x;
    if (phase2 >= 1) {
      phase2 -= 2;
    }
    phase1 += freq1x;
    if (phase1 >= 1) {
      phase1 -= 2;
      phase2 = (phase1 + 1) * freq2x / freq1x - 1;
    }
    out[i] = z;
  }
  this._phase1 = phase1;
  this._phase2 = phase2;
};
dspProcess["next_ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq1In = this.inputs[0];
  const freq2In = this.inputs[1];
  const freqMul = this._freqMul;
  const freq2x = freq2In[0] * freqMul;
  let phase1 = this._phase1;
  let phase2 = this._phase2;
  for (let i = 0; i < inNumSamples; i++) {
    const z = phase2;
    const freq1x = freq1In[i] * freqMul;
    phase2 += freq2x;
    if (phase2 >= 1) {
      phase2 -= 2;
    }
    phase1 += freq1x;
    if (phase1 >= 1) {
      phase1 -= 2;
      phase2 = (phase1 + 1) * freq2x / freq1x - 1;
    }
    out[i] = z;
  }
  this._phase1 = phase1;
  this._phase2 = phase2;
};
dspProcess["next_ka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq1In = this.inputs[0];
  const freq2In = this.inputs[1];
  const freqMul = this._freqMul;
  const freq1x = freq1In[0] * freqMul;
  let phase1 = this._phase1;
  let phase2 = this._phase2;
  for (let i = 0; i < inNumSamples; i++) {
    const z = phase2;
    const freq2x = freq2In[i] * freqMul;
    phase2 += freq2x;
    if (phase2 >= 1) {
      phase2 -= 2;
    }
    phase1 += freq1x;
    if (phase1 >= 1) {
      phase1 -= 2;
      phase2 = (phase1 + 1) * freq2x / freq1x - 1;
    }
    out[i] = z;
  }
  this._phase1 = phase1;
  this._phase2 = phase2;
};
dspProcess["next_kk"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq1x = this.inputs[0][0] * this._freqMul;
  const freq2x = this.inputs[1][0] * this._freqMul;
  let phase1 = this._phase1;
  let phase2 = this._phase2;
  for (let i = 0; i < inNumSamples; i++) {
    const z = phase2;
    phase2 += freq2x;
    if (phase2 >= 1) {
      phase2 -= 2;
    }
    phase1 += freq1x;
    if (phase1 >= 1) {
      phase1 -= 2;
      phase2 = (phase1 + 1) * freq2x / freq1x - 1;
    }
    out[i] = z;
  }
  this._phase1 = phase1;
  this._phase2 = phase2;
};
SCUnitRepository.registerSCUnitClass("SyncSaw", SCUnitSyncSaw);
module.exports = SCUnitSyncSaw;
