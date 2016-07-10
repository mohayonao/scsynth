"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitFSinOsc extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._radiansPerSample = rate.radiansPerSample;
    this._freq = this.inputs[0][0];
    const iphase = this.inputs[1][0];
    const w = this._freq * this._radiansPerSample;
    this._b1 = 2 * Math.cos(w);
    this._y1 = Math.sin(iphase);
    this._y2 = Math.sin(iphase - w);
    this.outputs[0][0] = this._y1;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const freq = this.inputs[0][0];
  if (freq !== this._freq) {
    this._freq = freq;
    this._b1 = 2 * Math.cos(freq * this._radiansPerSample);
  }
  const b1 = this._b1;
  let y1 = this._y1;
  let y2 = this._y2;
  for (let i = 0; i < inNumSamples; i++) {
    const y0 = b1 * y1 - y2;
    out[i] = y0;
    y2 = y1;
    y1 = y0;
  }
  this._y1 = y1;
  this._y2 = y2;
};
SCUnitRepository.registerSCUnitClass("FSinOsc", SCUnitFSinOsc);
module.exports = SCUnitFSinOsc;
