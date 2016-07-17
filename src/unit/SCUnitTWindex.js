"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitTWindex extends SCUnit {
  initialize() {
    assert(3 <= this.inputs.length);
    this.dspProcess = dspProcess["a"];

    this._prevIndex = 0;
    this._trig = 1;

    this.dspProcess(1);
  }
}

dspProcess["k"] = function(inNumSamples) {
  const out = this.outputs[0];
  const trig = this.inputs[0][0];
  const normalize = this.inputs[1][0];
  const maxindex = this.inputs.length;

  let index = maxindex;
  let sum = 0;
  let maxSum = 0;

  if (0 < trig && this._trig <= 0) {
    if (normalize === 1) {
      for (let k = 2; k < maxindex; k++) {
        maxSum += this.inputs[k][0];
      }
    } else {
      maxSum = 1;
    }
    const max = maxSum * Math.random();

    for (let k = 2; k < maxindex; k++) {
      sum += this.inputs[k][0];
      if (max <= sum) {
        index = k - 2;
        break;
      }
    }

    this._prevIndex = index;
  } else {
    index = this._prevIndex;
  }

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = index;
  }

  this._trig = trig;
};

dspProcess["ak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const trigIn = this.inputs[0];
  const normalize = this.inputs[1][0];
  const maxindex = this.inputs.length;

  let index = maxindex;
  let sum = 0;
  let maxSum = 0;
  let curtrig;

  if (normalize === 1) {
    for (let k = 2; k < maxindex; k++) {
      maxSum += this.inputs[k][0];
    }
  } else {
    maxSum = 1;
  }

  for (let i = 0; i < inNumSamples; i++) {
    curtrig = trigIn[i];

    if (0 < curtrig && this._trig <= 0) {
      const max = maxSum * Math.random();

      for (let k = 2; k < maxindex; k++) {
        sum += this.inputs[k][0];
        if (max <= sum) {
          index = k - 2;
          break;
        }
      }
      this._prevIndex = index;
    } else {
      index = this._prevIndex;
    }

    out[i] = index;
    this._trig = curtrig;
  }
};

SCUnitRepository.registerSCUnitClass("TWindex", SCUnitTWindex);

module.exports = SCUnitTWindex;
