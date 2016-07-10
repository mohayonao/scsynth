"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitT2A extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this.dspProcess(1);
  }
}
dspProcess["next"] = function () {
  const out = this.outputs[0];
  const level = this.input[0][0];
  out.fill(0);
  if (this._level <= 0 && level > 0) {
    this.outputs[0][this.input[1][0] | 0] = level;
  }
  this._level = level;
};
SCUnitRepository.registerSCUnitClass("T2A", SCUnitT2A);
module.exports = SCUnitT2A;
