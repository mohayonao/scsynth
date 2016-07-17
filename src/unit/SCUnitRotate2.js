"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sine = require("./_sine");

const gSine = sine.gSine;
const kSineSize = sine.kSineSize;
const kSineSize2 = kSineSize >> 1;
const kSineSize4 = kSineSize >> 2;
const kSineMask = sine.kSineMask;
const dspProcess = {};

class SCUnitRotate2 extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 3);
    assert(this.inputSpecs[0].rate === this.inputSpecs[1].rate);

    this.dspProcess = dspProcess["aak"];

    this._slopeFactor = rate.slopeFactor;
    this._pos = this.inputs[2][0];

    const isinpos = kSineMask & Math.floor((kSineSize2 * this._pos));
    const icospos = kSineMask & (kSineSize4 + isinpos);

    this._sint = gSine[isinpos];
    this._cost = gSine[icospos];

    this.dspProcess(1);
  }
}

dspProcess["aak"] = function(inNumSamples) {
  const outX = this.outputs[0];
  const outY = this.outputs[1];
  const inInX = this.inputs[0];
  const inInY = this.inputs[1];
  const next_pos = this.inputs[2][0];
  const sint = this._sint;
  const cost = this._cost;

  if (this._pos !== next_pos) {
    const isinpos = kSineMask & Math.floor((kSineSize2 * next_pos));
    const icospos = kSineMask & (kSineSize4 + isinpos);
    const next_sint = gSine[isinpos];
    const next_cost = gSine[icospos];
    const sint_slope = (next_sint - sint) * this._slopeFactor;
    const cost_slope = (next_cost - cost) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const x = inInX[i];
      const y = inInY[i];

      outX[i] = (cost + cost_slope * i) * x + (sint + sint_slope * i) * y;
      outY[i] = (cost + cost_slope * i) * x - (sint + sint_slope * i) * y;
    }

    this._pos = next_pos;
    this._sint = next_sint;
    this._cost = next_cost;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      const x = inInX[i];
      const y = inInY[i];

      outX[i] = cost * x + sint * y;
      outY[i] = cost * x - sint * y;
    }
  }
};

SCUnitRepository.registerSCUnitClass("Rotate2", SCUnitRotate2);

module.exports = SCUnitRotate2;
