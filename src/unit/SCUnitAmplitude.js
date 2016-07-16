"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

const log1 = Math.log(0.1);

class SCUnitAmplitude extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 3);

    if (this.calcRate !== C.RATE_AUDIO && this.inputSpecs[0].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["akk/atok"];
    } else {
      this.dspProcess = dspProcess["akk"];
    }

    const clamp = this.inputs[1][0];
    const relax = this.inputs[2][0];

    this._sampleRate = rate.sampleRate;
    this._fullBufferLength = this.context.aRate.bufferLength;
    this._clampCoef = clamp ? Math.exp(log1 / (clamp * this._sampleRate)) : 0;
    this._relaxCoef = relax ? Math.exp(log1 / (relax * this._sampleRate)) : 0;
    this._prevClamp = clamp;
    this._prevRelax = relax;
    this._prevIn = Math.abs(this.inputs[0][0]);

    this.dspProcess(1);
  }
}

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const clamp = this.inputs[1][0];
  const relax = this.inputs[2][0];

  if (clamp !== this._prevClamp) {
    this._clampCoef = clamp ? Math.exp(log1 / (clamp * this._sampleRate)) : 0;
    this._prevClamp = clamp;
  }
  if (relax !== this._prevRelax) {
    this._relaxCoef = relax ? Math.exp(log1 / (relax * this._sampleRate)) : 0;
    this._prevRelax = relax;
  }

  const clampCoef = this._clampCoef;
  const relaxCoef = this._relaxCoef;

  let val = 0;
  let prevIn = this._prevIn;

  for (let i = 0; i < inNumSamples; i++) {
    val = Math.abs(inIn[i]);

    if (val < prevIn) {
      val += (prevIn - val) * relaxCoef;
    } else {
      val += (prevIn - val) * clampCoef;
    }

    out[i] = prevIn = val;
  }

  this._prevIn = prevIn;
};

dspProcess["akk/atok"] = function(inNumSamples) {
  const inIn = this.inputs[0];
  const clamp = this.inputs[1][0];
  const relax = this.inputs[2][0];

  if (clamp !== this._prevClamp) {
    this._clampCoef = clamp ? Math.exp(log1 / (clamp * this._sampleRate)) : 0;
    this._prevClamp = clamp;
  }
  if (relax !== this._prevRelax) {
    this._relaxCoef = relax ? Math.exp(log1 / (relax * this._sampleRate)) : 0;
    this._prevRelax = relax;
  }

  const clampCoef = this._clampCoef;
  const relaxCoef = this._relaxCoef;

  let val = 0;
  let prevIn = this._prevIn;

  for (let i = 0; i < inNumSamples; i++) {
    val = Math.abs(inIn[i]);

    if (val < prevIn) {
      val += (prevIn - val) * relaxCoef;
    } else {
      val += (prevIn - val) * clampCoef;
    }

    prevIn = val;
  }

  this.outputs[0][0] = val;
  this._prevIn = prevIn;
};

SCUnitRepository.registerSCUnitClass("Amplitude", SCUnitAmplitude);

module.exports = SCUnitAmplitude;
