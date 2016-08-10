"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitCrackle extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["k"];
    this._y1 = Math.random();
    this._y2 = 0;
    this.dspProcess(1);
  }
}

dspProcess["k"] = function(inNumSamples) {
  const out = this.outputs[0];
  const paramf = this.inputs[0][0];

  let y1 = this._y1;
  let y2 = this._y2;

  for (let i = 0; i < inNumSamples; i++) {
    const y0 = Math.abs(y1 * paramf - y2 - 0.05);

    out[i] = y0;
    y2 = y1;
    y1 = y0;
  }

  this._y1 = y1;
  this._y2 = y2;
};

SCUnitRepository.registerSCUnitClass("Crackle", SCUnitCrackle);

module.exports = SCUnitCrackle;
