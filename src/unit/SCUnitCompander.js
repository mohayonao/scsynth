"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

const log1 = Math.log(0.1);

class SCUnitCompander extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 7);

    this.dspProcess = dspProcess["aakkkkk"];

    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._clamp = 0;
    this._relax = 0;
    this._clampCoef = 0;
    this._relaxCoef = 0;
    this._prevMaxVal = 0;
    this._gain = 0;

    this.dspProcess(1);
  }
}

dspProcess["aakkkkk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const controlIn = this.inputs[1];
  const thresh = this.inputs[2][0];
  const slope_below = this.inputs[3][0];
  const slope_above = this.inputs[4][0];
  const clamp = this.inputs[5][0];
  const relax = this.inputs[6][0];

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

  let prevMaxVal = this._prevMaxVal;

  for (let i = 0; i < inNumSamples; i++) {
    let val = Math.abs(controlIn[i]);

    if (val < prevMaxVal) {
      val += (prevMaxVal - val) * relaxCoef;
    } else {
      val += (prevMaxVal - val) * clampCoef;
    }

    prevMaxVal = val;
  }

  this._prevMaxVal = prevMaxVal;

  let next_gain;

  if (prevMaxVal < thresh) {
    if (slope_below === 1) {
      next_gain = 1;
    } else {
      next_gain = Math.pow(prevMaxVal / thresh, slope_below - 1);
      const absx = Math.abs(next_gain);

      next_gain = ((absx < 1e-15) ? 0 : ((1e15 < absx) ? 1 : next_gain)) || 0;
    }
  } else {
    if (slope_above === 1) {
      next_gain = 1;
    } else {
      next_gain = Math.pow(prevMaxVal / thresh, slope_above - 1) || 0;
    }
  }

  const gain = this._gain;
  const gain_slope = (next_gain - gain) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = inIn[i] * (gain + gain_slope * i);
  }

  this._gain = next_gain;
};

SCUnitRepository.registerSCUnitClass("Compander", SCUnitCompander);

module.exports = SCUnitCompander;
