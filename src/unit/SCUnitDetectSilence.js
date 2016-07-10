"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitDetectSilence extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._thresh = this.inputs[1][0];
    this._endCounter = rate.sampleRate * this.inputs[2][0] | 0;
    this._counter = -1;
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const thresh = this._thresh;
  let counter = this._counter;
  for (let i = 0; i < inNumSamples; i++) {
    const val = Math.abs(inIn[i]);
    if (val > thresh) {
      counter = 0;
      out[i] = 0;
    } else if (counter >= 0) {
      counter += 1;
      if (counter >= this._endCounter) {
        this.doneAction(this.inputs[3][0] | 0);
        out[i] = 1;
      } else {
        out[i] = 0;
      }
    } else {
      out[i] = 0;
    }
  }
  this._counter = counter;
};
SCUnitRepository.registerSCUnitClass("DetectSilence", SCUnitDetectSilence);
module.exports = SCUnitDetectSilence;
