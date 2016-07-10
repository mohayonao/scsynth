"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitTrig1 extends SCUnit {
  initialize(rate) {
    if (this.calcRate === C.RATE_AUDIO && this.inputSpecs[0].rate !== C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_k"];
    } else {
      this.dspProcess = dspProcess["next"];
    }
    this._sr = rate.sampleRate;
    this._counter = 0;
    this._trig = 0;
    this.outputs[0][0] = 0;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const dur = this.inputs[1][0];
  const sr = this._sr;
  let trig = this._trig;
  let counter = this._counter;
  let curTrig, zout;
  for (let i = 0; i < inNumSamples; i++) {
    curTrig = trigIn[i];
    if (counter > 0) {
      counter -= 1;
      zout = counter ? 1 : 0;
    } else {
      if (curTrig > 0 && trig <= 0) {
        counter = Math.max(1, dur * sr + 0.5 | 0);
        zout = 1;
      } else {
        zout = 0;
      }
    }
    out[i] = zout;
    trig = curTrig;
  }
  this._trig = trig;
  this._counter = counter;
};
dspProcess["next_k"] = function (inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const dur = this.inputs[1][0];
  const sr = this._sr;
  let trig = this._trig;
  let counter = this._counter;
  let curTrig, zout;
  curTrig = trigIn[0];
  for (let i = 0; i < inNumSamples; i++) {
    if (counter > 0) {
      counter -= 1;
      zout = counter ? 1 : 0;
    } else {
      if (curTrig > 0 && trig <= 0) {
        counter = Math.max(1, dur * sr + 0.5 | 0);
        zout = 1;
      } else {
        zout = 0;
      }
    }
    out[i] = zout;
    trig = curTrig;
  }
  this._trig = trig;
  this._counter = counter;
};
SCUnitRepository.registerSCUnitClass("Trig1", SCUnitTrig1);
module.exports = SCUnitTrig1;
