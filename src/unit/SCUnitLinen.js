"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitLinen extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._level = 0;
    this._stage = 4;
    this._prevGate = 0;
    this._slope = 0;
    this._counter = 0;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function () {
  const out = this.outputs[0];
  const gate = this.inputs[0][0];
  if (this._prevGate <= 0 && gate > 0) {
    this.done = false;
    this._stage = 0;
    const attackTime = this.inputs[1][0];
    const susLevel = this.inputs[2][0];
    const counter = Math.max(1, attackTime * this._sampleRate | 0);
    this._slope = (susLevel - this._level) / counter;
    this._counter = counter;
  }
  switch (this._stage) {
  case 0:
  case 2:
    out[0] = this._level;
    this._level += this._slope;
    this._counter -= 1;
    if (this._counter === 0) {
      this._stage += 1;
    }
    break;
  case 1:
    out[0] = this._level;
    if (gate <= -1) {
      const releaseTime = -gate - 1;
      const counter = Math.max(1, releaseTime * this._sampleRate | 0);
      this._stage = 2;
      this._slope = -this._level / counter;
      this._counter = counter;
    } else if (gate <= 0) {
      const releaseTime = this.inputs[3][0];
      const counter = Math.max(1, releaseTime * this._sampleRate | 0);
      this._stage = 2;
      this._slope = -this._level / counter;
      this._counter = counter;
    }
    break;
  case 3:
    out[0] = 0;
    this.done = true;
    this._stage = 4;
    this.doneAction(this.inputs[4][0]);
    break;
  case 4:
    out[0] = 0;
    break;
  }
  this._prevGate = gate;
};
SCUnitRepository.registerSCUnitClass("Linen", SCUnitLinen);
module.exports = SCUnitLinen;
