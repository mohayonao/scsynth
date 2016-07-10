"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitT2K extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["next"];
    this.outputs[0][0] = this.input[0][0];
  }
}
dspProcess["next"] = function () {
  const inIn = this.input[0];
  let out = 0;
  for (let i = 0, imax = inIn.length; i < imax; i++) {
    const val = inIn[i];
    if (val > out) {
      out = val;
    }
  }
  this.outputs[0][0] = out;
};
SCUnitRepository.registerSCUnitClass("T2K", SCUnitT2K);
module.exports = SCUnitT2K;
