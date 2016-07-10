"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLinLin extends SCUnit {
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
    this._scale = 1;
    this._offset = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const next_srclo = this.inputs[1][0];
  const next_srchi = this.inputs[2][0];
  const next_dstlo = this.inputs[3][0];
  const next_dsthi = this.inputs[4][0];
  const srclo = this._srclo;
  const srchi = this._srchi;
  const dstlo = this._dstlo;
  const dsthi = this._dsthi;
  const scale = this._scale;
  const offset = this._offset;
  if (srclo !== next_srclo || srchi !== next_srchi || dstlo !== next_dstlo || dsthi !== next_dsthi) {
    const next_scale = (next_dsthi - next_dstlo) / (next_srchi - next_srclo) || 0;
    const next_offset = next_dstlo - next_scale * next_srclo;
    const scale_slope = (next_scale - scale) * this._slopeFactor;
    const offset_slope = (next_offset - offset) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = inIn[i] * (scale + scale_slope * i) + (offset + offset_slope * i);
    }
    this._srclo = next_srclo;
    this._srchi = next_srchi;
    this._dstlo = next_dstlo;
    this._dsthi = next_dsthi;
    this._scale = next_scale;
    this._offset = next_offset;
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = inIn[i] * scale + offset;
    }
  }
};
dspProcess["next_1"] = function () {
  const _in = this.inputs[0][0];
  const srclo = this.inputs[1][0];
  const srchi = this.inputs[2][0];
  const dstlo = this.inputs[3][0];
  const dsthi = this.inputs[4][0];
  if (this._srclo !== srclo || this._srchi !== srchi || this._dstlo !== dstlo || this._dsthi !== dsthi) {
    this._srclo = srclo;
    this._srchi = srchi;
    this._dstlo = dstlo;
    this._dsthi = dsthi;
    this._scale = (dsthi - dstlo) / (srchi - srclo) || 0;
    this._offset = dstlo - this._scale * srclo;
  }
  this.outputs[0][0] = _in * this._scale + this._offset;
};
SCUnitRepository.registerSCUnitClass("LinLin", SCUnitLinLin);
module.exports = SCUnitLinLin;
