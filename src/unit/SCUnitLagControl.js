"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitLagControl extends SCUnit {
  initialize(rate) {
    if (this.outputs.length === 1) {
      this.dspProcess = dspProcess["1"];
    } else {
      this.dspProcess = dspProcess["k"];
    }
    const numberOfOutputs = this.outputs.length;
    const sampleRate = rate.sampleRate;
    this._controls = this.synth.params;
    this._y1 = new Float32Array(numberOfOutputs);
    this._b1 = new Float32Array(numberOfOutputs);
    for (let i = 0; i < numberOfOutputs; i++) {
      const lag = this.inputs[i][0];
      this._y1[i] = this._controls[i];
      this._b1[i] = lag === 0 ? 0 : Math.exp(log001 / (lag * sampleRate));
    }
    this.dspProcess(1);
  }
}
dspProcess["1"] = function () {
  const y1 = this._y1;
  const b1 = this._b1;
  const z = this._controls[this.specialIndex];
  const x = z + b1[0] * (y1[0] - z);
  this.outputs[0][0] = y1[0] = x;
};
dspProcess["k"] = function () {
  const controls = this._controls;
  const outputs = this.outputs;
  const numberOfOutputs = this.outputs.length;
  const specialIndex = this.specialIndex;
  const y1 = this._y1;
  const b1 = this._b1;
  for (let i = 0; i < numberOfOutputs; i++) {
    const z = controls[specialIndex + i];
    const x = z + b1[i] * (y1[i] - z);
    outputs[i][0] = y1[i] = x;
  }
};
SCUnitRepository.registerSCUnitClass("LagControl", SCUnitLagControl);
module.exports = SCUnitLagControl;
