"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitDelay2 extends SCUnit {
  initialize() {
    if (this.bufferLength === 1) {
      this.dspProcess = dspProcess["next_1"];
    } else {
      this.dspProcess = dspProcess["next"];
    }

    this._x1 = 0;
    this._x2 = 0;

    this.dspProcess(1);
  }
}


dspProcess["next"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];

  let x1 = this._x1;
  let x2 = this._x2;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = x1;
    x1 = x2;
    x2 = inIn[i];
  }

  this._x1 = x1;
  this._x2 = x2;
};

dspProcess["next_1"] = function() {
  this.outputs[0][0] = this._x1;
  this._x1 = this._x2;
  this._x2 = this.inputs[0][0];
};

SCUnitRepository.registerSCUnitClass("Delay2", SCUnitDelay2);

module.exports = SCUnitDelay2;
