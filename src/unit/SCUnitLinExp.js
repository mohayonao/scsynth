"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLinExp extends SCUnit {
  initialize(rate) {
    if (this.calcRate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next"];
    } else {
      this.dspProcess = dspProcess["next_1"];
    }
    this._slopeFactor = rate.slopeFactor;
    this._srclo = 0;
    this._srchi = 0;
    this._dstlo = 0;
    this._dsthi = 0;
    this._x = 0;
    this._y = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const next_srclo = this.inputs[1][0];
  const next_srchi = this.inputs[2][0];
  const next_dstlo = this.inputs[3][0] || 0.001;
  const next_dsthi = this.inputs[4][0] || 0.001;
  const srclo = this._srclo;
  const srchi = this._srchi;
  const dstlo = this._dstlo;
  const dsthi = this._dsthi;
  const x = this._x;
  const y = this._y;
  if (srclo !== next_srclo || srchi !== next_srchi || dstlo !== next_dstlo || dsthi !== next_dsthi) {
    const next_x = dsthi / dstlo;
    const next_y = srchi - srclo || 0.001;
    const x_slope = (next_x - x) * this._slopeFactor;
    const y_slope = (next_y - y) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = Math.pow(x + x_slope * i, (inIn[i] - srclo) / (y + y_slope * i)) * dstlo;
    }
    this._srclo = next_srclo;
    this._srchi = next_srchi;
    this._dstlo = next_dstlo;
    this._dsthi = next_dsthi;
    this._x = next_x;
    this._y = next_y;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = Math.pow(x, (inIn[i] - srclo) / y) * dstlo;
    }
  }
};
dspProcess["next_1"] = function () {
  const _in = this.inputs[0][0];
  const srclo = this.inputs[1][0];
  const srchi = this.inputs[2][0];
  const dstlo = this.inputs[3][0] || 0.001;
  const dsthi = this.inputs[4][0] || 0.001;
  if (this._srclo !== srclo || this._srchi !== srchi || this._dstlo !== dstlo || this._dsthi !== dsthi) {
    this._srclo = srclo;
    this._srchi = srchi;
    this._dstlo = dstlo;
    this._dsthi = dsthi;
    this._x = dsthi / dstlo;
    this._y = srchi - srclo || 0.001;
  }
  this.outputs[0][0] = Math.pow(this._x, (_in - srclo) / this._y) * dstlo;
};
SCUnitRepository.registerSCUnitClass("LinExp", SCUnitLinExp);
module.exports = SCUnitLinExp;
