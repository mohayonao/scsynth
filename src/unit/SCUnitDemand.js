"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

class SCUnitDemand extends SCUnit {
  initialize() {
    assert(
      this.calcRate === this.inputSpecs[0].rate
    );

    this.dspProcess = dspProcess[$r2k(this)];

    this._prevtrig = 0;
    this._prevreset = 0;
    this._prevout = new Float32Array(this.outputs.length);
  }
}

function $r2k(unit) {
  return unit.inputSpecs.slice(0, 2).map(({ rate }) => {
    if (rate === C.RATE_AUDIO) {
      return "a";
    }
    return rate === C.RATE_SCALAR ? "i" : "k";
  }).join("");
}

dspProcess["aa"] = function(inNumSamples) {
  const outputs = this.outputs;
  const trigIn = this.inputs[0];
  const resetIn = this.inputs[1];
  const prevout = this._prevout;
  const numberOfDemandUGens = prevout.length;

  let prevtrig = this._prevtrig;
  let prevreset = this._prevreset;

  for (let i = 0; i < inNumSamples; i++) {
    const ztrig = trigIn[i];
    const zreset = resetIn[i];

    if (0 < zreset && prevreset <= 0) {
      for (let j = 0; j < numberOfDemandUGens; j++) {
        demand.reset(this, j + 2);
      }
    }
    if (0 < ztrig && prevtrig <= 0) {
      for (let j = 0; j < numberOfDemandUGens; j++) {
        const x = demand.next(this, j + 2, i + 1);

        if (Number.isNaN(x)) {
          outputs[j][i] = prevout[j];
          this.done = true;
        } else {
          outputs[j][i] = prevout[j] = x;
        }
      }
    } else {
      for (let j = 0; j < numberOfDemandUGens; j++) {
        outputs[j][i] = prevout[j];
      }
    }
    prevtrig = ztrig;
    prevreset = zreset;
  }

  this._prevtrig = prevtrig;
  this._prevreset = prevreset;
};

dspProcess["ak"] = function(inNumSamples) {
  const outputs = this.outputs;
  const trigIn = this.inputs[0];
  const zreset = this.inputs[1][0];
  const prevout = this._prevout;
  const numberOfDemandUGens = prevout.length;

  if (0 < zreset && this._prevreset <= 0) {
    for (let j = 0; j < numberOfDemandUGens; j++) {
      demand.reset(this, j + 2);
    }
  }
  this._prevreset = zreset;

  let prevtrig = this._prevtrig;

  for (let i = 0; i < inNumSamples; i++) {
    const ztrig = trigIn[i];

    if (0 < ztrig && prevtrig <= 0) {
      for (let j = 0; j < numberOfDemandUGens; j++) {
        const x = demand.next(this, j + 2, i + 1);

        if (Number.isNaN(x)) {
          outputs[j][i] = prevout[j];
          this.done = true;
        } else {
          outputs[j][i] = prevout[j] = x;
        }
      }
    } else {
      for (let j = 0; j < numberOfDemandUGens; j++) {
        outputs[j][i] = prevout[j];
      }
    }
    prevtrig = ztrig;
  }

  this._prevtrig = prevtrig;
};

dspProcess["ai"] = dspProcess["ak"];
dspProcess["ad"] = dspProcess["ak"];

dspProcess["kk"] = function() {
  const outputs = this.outputs;
  const trig = this.inputs[0][0];
  const reset = this.inputs[1][0];
  const prevout = this._prevout;
  const numberOfDemandUGens = prevout.length;

  if (0 < reset && this._prevreset <= 0) {
    for (let j = 0; j < numberOfDemandUGens; j++) {
      demand.reset(this, j + 2);
    }
  }
  if (0 < trig && this._prevtrig <= 0) {
    for (let j = 0; j < numberOfDemandUGens; j++) {
      const x = demand.next(this, j + 2, 1);

      if (Number.isNaN(x)) {
        outputs[j][0] = prevout[j];
        this.done = true;
      } else {
        outputs[j][0] = prevout[j] = x;
      }
    }
  } else {
    for (let j = 0; j < numberOfDemandUGens; j++) {
      outputs[j][0] = prevout[j];
    }
  }

  this._prevtrig = trig;
  this._prevreset = reset;
};

dspProcess["ka"] = dspProcess["kk"];
dspProcess["ki"] = dspProcess["kk"];
dspProcess["kd"] = dspProcess["kk"];

SCUnitRepository.registerSCUnitClass("Demand", SCUnitDemand);

module.exports = SCUnitDemand;
