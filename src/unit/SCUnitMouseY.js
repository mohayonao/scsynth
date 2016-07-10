"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitMouseY extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._y1 = 0;
    this._b1 = 0;
    this._lag = 0;
    this._pointVal = this.context.uiValues.subarray(C.UI_MOUSE_Y, C.UI_MOUSE_Y + 1);
    this.dspProcess(1);
  }
}
dspProcess["next"] = function () {
  let minval = this.inputs[0][0] || 0.01;
  let maxval = this.inputs[1][0];
  let warp = this.inputs[2][0];
  let lag = this.inputs[3][0];
  let y1 = this._y1;
  let b1 = this._b1;
  if (lag !== this._lag) {
    this._b1 = lag === 0 ? 0 : Math.exp(log001 / (lag * this._sampleRate));
    this._lag = lag;
  }
  let y0 = this._pointVal[0];
  if (warp === 0) {
    y0 = (maxval - minval) * y0 + minval;
  } else {
    y0 = Math.pow(maxval / minval, y0) * minval;
    if (isNaN(y0)) {
      y0 = 0;
    }
  }
  this.outputs[0][0] = y1 = y0 + b1 * (y1 - y0);
  this._y1 = y1;
};
SCUnitRepository.registerSCUnitClass("MouseY", SCUnitMouseY);
module.exports = SCUnitMouseY;
