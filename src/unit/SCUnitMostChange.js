"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

const dspProcess = {};

class SCUnitMostChange extends SCUnit {
  initialize() {
    assert(this.inputs.length === 2);

    if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
      if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
        this.dspProcess = dspProcess["aa"];
      } else {
        this.dspProcess = dspProcess["ak"];
      }
    } else if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["ka"];
    } else {
      this.dspProcess = dspProcess["aa"];
    }

    this._prevA = 0;
    this._prevB = 0;
    this._recent = 1;

    this.dspProcess(1);
  }
}

dspProcess["aa"] = function(inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const bIn = this.inputs[1];

  let prevA = this._prevA;
  let prevB = this._prevB;
  let recent = this._recent;

  for (let i = 0; i < inNumSamples; i++) {
    const xa = aIn[i];
    const xb = bIn[i];
    const diff = Math.abs(xa - prevA) - Math.abs(xb - prevB);

    if (0 < diff) {
      recent = 0;
      out[i] = xa;
    } else if (diff < 0) {
      recent = 1;
      out[i] = xb;
    } else {
      out[i] = recent ? xb : xa;
    }

    prevA = xa;
    prevB = xb;
  }

  this._prevA = prevA;
  this._prevB = prevB;
  this._recent = recent;
};

dspProcess["ak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const xb = this.inputs[1][0];
  const db = Math.abs(xb - this._prevB);

  let prevA = this._prevA;
  let recent = this._recent;

  for (let i = 0; i < inNumSamples; i++) {
    const xa = aIn[i];
    const diff = Math.abs(xa - prevA) - db;

    if (0 < diff) {
      recent = 0;
      out[i] = xa;
    } else if (diff < 0) {
      recent = 1;
      out[i] = xb;
    } else {
      out[i] = recent ? xb : xa;
    }

    prevA = xa;
  }

  this._prevA = prevA;
  this._prevB = db;
  this._recent = recent;
};

dspProcess["ka"] = function(inNumSamples) {
  const out = this.outputs[0];
  const xa = this.inputs[0][0];
  const da = Math.abs(xa - this._prevA);
  const bIn = this.inputs[1];

  let prevB = this._prevB;
  let recent = this._recent;

  for (let i = 0; i < inNumSamples; i++) {
    const xb = bIn[i];
    const diff = da - Math.abs(xb - prevB);

    if (0 < diff) {
      recent = 0;
      out[i] = xa;
    } else if (diff < 0) {
      recent = 1;
      out[i] = xb;
    } else {
      out[i] = recent ? xb : xa;
    }

    prevB = xb;
  }

  this._prevA = xa;
  this._prevB = prevB;
  this._recent = recent;
};

SCUnitRepository.registerSCUnitClass("MostChange", SCUnitMostChange);

module.exports = SCUnitMostChange;
