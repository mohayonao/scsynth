"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

const log001 = Math.log(0.001);
const dspProcess = {};

class SCUnitFormlet extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 4);

    if (this.calcRate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["a"];
    } else {
      this.dspProcess = dspProcess["1"];
    }

    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._radiansPerSample = rate.radiansPerSample;

    this._b01 = 0;
    this._b02 = 0;
    this._y01 = 0;
    this._y02 = 0;
    this._b11 = 0;
    this._b12 = 0;
    this._y11 = 0;
    this._y12 = 0;
    this._freq = NaN;
    this._attackTime = NaN;
    this._decayTime = NaN;

    this.dspProcess(1);
  }
}

dspProcess["a"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const freq = this.inputs[1][0];
  const attackTime = this.inputs[2][0];
  const decayTime = this.inputs[3][0];
  const b01 = this._b01;
  const b11 = this._b11;
  const b02 = this._b02;
  const b12 = this._b12;

  let y00;
  let y10;
  let y01 = this._y01;
  let y11 = this._y11;
  let y02 = this._y02;
  let y12 = this._y12;
  let R, twoR, R2, cost;

  if (freq != this._freq || decayTime != this._decayTime || attackTime != this._attackTime) {
    const ffreq = freq * this._radiansPerSample;

    R = decayTime ? Math.exp(log001/(decayTime * this._sampleRate)) : 0;
    twoR = 2 * R;
    R2 = R * R;
    cost = (twoR * Math.cos(ffreq)) / (1 + R2);

    const b01_next = twoR * cost;
    const b02_next = -R2;
    const b01_slope = (b01_next - b01) * this._slopeFactor;
    const b02_slope = (b02_next - b02) * this._slopeFactor;

    R = attackTime ? Math.exp(log001/(attackTime * this._sampleRate)) : 0;
    twoR = 2 * R;
    R2 = R * R;
    cost = (twoR * Math.cos(ffreq)) / (1 + R2);

    const b11_next = twoR * cost;
    const b12_next = -R2;
    const b11_slope = (b11_next - b11) * this._slopeFactor;
    const b12_slope = (b12_next - b12) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      y00 = inIn[i] + (b01 + b01_slope * i) * y01 + (b02 + b02_slope * i) * y02;
      y10 = inIn[i] + (b11 + b11_slope * i) * y11 + (b12 + b12_slope * i) * y12;

      out[i] = 0.25 * ((y00 - y02) - (y10 - y12));

      y02 = y01;
      y01 = y00;
      y12 = y11;
      y11 = y10;
    }

    this._freq = freq;
    this._attackTime = attackTime;
    this._decayTime = decayTime;
    this._b01 = b01_next;
    this._b02 = b02_next;
    this._b11 = b11_next;
    this._b12 = b12_next;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      y00 = inIn[i] + b01 * y01 + b02 * y02;
      y10 = inIn[i] + b11 * y11 + b12 * y12;

      out[i] = 0.25 * ((y00 - y02) - (y10 - y12));

      y02 = y01;
      y01 = y00;
      y12 = y11;
      y11 = y10;
    }
  }

  this._y01 = y01;
  this._y02 = y02;
  this._y11 = y11;
  this._y12 = y12;
};

dspProcess["1"] = function() {
  const _in = this.inputs[0][0];
  const freq = this.inputs[1][0];
  const attackTime = this.inputs[2][0];
  const decayTime = this.inputs[3][0];

  let y00;
  let y10;
  let y01 = this._y01;
  let y11 = this._y11;
  let y02 = this._y02;
  let y12 = this._y12;

  let b01 = this._b01;
  let b11 = this._b11;
  let b02 = this._b02;
  let b12 = this._b12;
  let R, twoR, R2, cost;

  if (freq != this._freq || decayTime != this._decayTime || attackTime != this._attackTime) {
    const ffreq = freq * this._radiansPerSample;

    R = decayTime ? Math.exp(log001/(decayTime * this._sampleRate)) : 0;
    twoR = 2 * R;
    R2 = R * R;
    cost = (twoR * Math.cos(ffreq)) / (1 + R2);
    b01 = twoR * cost;
    b02 = -R2;

    R = attackTime ? Math.exp(log001/(attackTime * this._sampleRate)) : 0;
    twoR = 2 * R;
    R2 = R * R;
    cost = (twoR * Math.cos(ffreq)) / (1 + R2);
    b11 = twoR * cost;
    b12 = -R2;

    y00 = _in + b01 * y01 + b02 * y02;
    y10 = _in + b11 * y11 + b12 * y12;

    this.outputs[0][0] = 0.25 * ((y00 - y02) - (y10 - y12));

    y02 = y01;
    y01 = y00;
    y12 = y11;
    y11 = y10;

    this._freq = freq;
    this._attackTime = attackTime;
    this._decayTime = decayTime;
    this._b01 = b01;
    this._b02 = b02;
    this._b11 = b11;
    this._b12 = b12;
  } else {
    y00 = _in + b01 * y01 + b02 * y02;
    y10 = _in + b11 * y11 + b12 * y12;

    this.outputs[0][0] = 0.25 * ((y00 - y02) - (y10 - y12));

    y02 = y01;
    y01 = y00;
    y12 = y11;
    y11 = y10;
  }

  this._y01 = y01;
  this._y02 = y02;
  this._y11 = y11;
  this._y12 = y12;
};

SCUnitRepository.registerSCUnitClass("Formlet", SCUnitFormlet);

module.exports = SCUnitFormlet;
