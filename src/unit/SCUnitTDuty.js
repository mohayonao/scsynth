"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};
const $r2k = {
  [C.RATE_SCALAR] : "di",
  [C.RATE_CONTROL]: "dk",
  [C.RATE_AUDIO]  : "da",
  [C.RATE_DEMAND] : "dd"
};

class SCUnitTDuty extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 5);
    assert(this.inputSpecs[0].rate === C.RATE_DEMAND);

    this.dspProcess = dspProcess[$r2k[this.inputSpecs[1].rate]];

    this._sampleRate = rate.sampleRate;
    this._prevreset = 0;
    this._count = 0;

    if (this.inputSpecs[1].rate === C.RATE_DEMAND) {
      this._prevreset = demand.next(this, 1, 1) * this._sampleRate;
    }
    if (this.inputs[4][0]) {
      this._count = demand.next(this, 0, 1) * this._sampleRate;
    }

    this.outputs[0][0] = 0;
  }
}

dspProcess["da"] = function(inNumSamples) {
  const out = this.outputs[0];
  const resetIn = this.inputs[1];
  const sampleRate = this._sampleRate;

  let count = this._count;
  let prevreset = this._prevreset;

  for (let i = 0; i < inNumSamples; i++) {
    const zreset = resetIn[i];

    if (0 < zreset && prevreset <= 0) {
      demand.reset(this, 0);
      demand.reset(this, 3);
      count = 0;
    }

    if (count <= 0) {
      count += demand.next(this, 0, i + 1) * sampleRate;
      if (Number.isNaN(count)) {
        this.doneAction(this.inputs[2][0]);
      }
      out[i] = demand.next(this, 3, i + 1) || 0;
    } else {
      out[i] = 0;
    }

    count -= 1;
    prevreset = zreset;
  }

  this._count = count;
  this._prevreset = prevreset;
};

dspProcess["dk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const zreset = this.inputs[1][0];
  const sampleRate = this._sampleRate;

  let count = this._count;

  if (0 < zreset && this._prevreset <= 0) {
    demand.reset(this, 0);
    demand.reset(this, 3);
    count = 0;
  }

  for (let i = 0; i < inNumSamples; i++) {
    if (count <= 0) {
      count += demand.next(this, 0, i + 1) * sampleRate;
      if (Number.isNaN(count)) {
        this.doneAction(this.inputs[2][0]);
      }
      out[i] = demand.next(this, 3, i + 1) || 0;
    } else {
      out[i] = 0;
    }
    count -= 1;
  }

  this._count = count;
  this._prevreset = zreset;
};

dspProcess["di"] = dspProcess["dk"];

dspProcess["dd"] = function(inNumSamples) {
  const out = this.outputs[0];
  const sampleRate = this._sampleRate;

  let count = this._count;
  let reset = this._prevreset;

  for (let i = 0; i < inNumSamples; i++) {
    if (reset <= 0) {
      demand.next(this, 0);
      demand.next(this, 3);
      count = 0;
      reset += demand.next(this, 1, i + 1) * sampleRate;
    } else {
      reset -= 1;
    }

    if (count <= 0) {
      count += demand.next(this, 0, i + 1) * sampleRate;
      if (Number.isNaN(count)) {
        this.doneAction(this.inputs[2][0]);
      }
      out[i] = demand.next(this, 3, i + 1) || 0;
    } else {
      out[i] = 0;
    }

    count -= 1;
  }

  this._count = count;
  this._prevreset = reset;
};

SCUnitRepository.registerSCUnitClass("TDuty", SCUnitTDuty);

module.exports = SCUnitTDuty;
