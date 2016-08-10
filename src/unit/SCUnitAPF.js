"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitAPF extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["akk"];

    this._radiansPerSample = rate.radiansPerSample;
    this._slopeFactor = rate.slopeFactor;
    this._b1 = 0;
    this._b2 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._x1 = 0;
    this._x2 = 0;
    this._freq = NaN;
    this._reson = NaN;

    this.dspProcess(1);
  }
}

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq_next = this.inputs[1][0];
  const reson_next = this.inputs[2][0];
  const freq = this._freq;
  const reson = this._reson;
  const b1 = this._b1;
  const b2 = this._b2;

  let y1 = this._y1;
  let y2 = this._y2;
  let x1 = this._x1;
  let x2 = this._x2;

  if (freq === freq_next && reson === reson_next) {
    for (let i = 0; i < inNumSamples; i++) {
      const x0 = inIn[i];
      const y0 = x0 + b1 * (y1 - x1) + b2 * (y2 - x2);

      out[i] = y0;

      y2 = y1;
      y1 = y0;
      x2 = x1;
      x1 = x0;
    }
  } else {
    const b1_next = 2 * reson_next * Math.cos(freq_next * this._radiansPerSample);
    const b2_next = -(reson_next * reson_next);
    const b1_slope = (b1_next - b1) * this._slopeFactor;
    const b2_slope = (b2_next - b2) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const x0 = inIn[i];
      const y0 = x0 + (b1 + b1_slope * i) * (y1 - x1) + (b2 + b2_slope * i) * (y2 - x2);

      out[i] = y0;

      y2 = y1;
      y1 = y0;
      x2 = x1;
      x1 = x0;
    }

    this._freq = freq_next;
    this._reson = reson_next;
    this._b1 = b1_next;
    this._b2 = b2_next;
  }

  this._y1 = y1;
  this._y2 = y2;
  this._x1 = x1;
  this._x2 = x2;
};

SCUnitRepository.registerSCUnitClass("APF", SCUnitAPF);

module.exports = SCUnitAPF;
