"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");

class SCUnitDC extends SCUnit {
  initialize() {
    assert(this.inputs.length === 1);
    fill(this.outputs[0], this.inputs[0][0]);
  }
}

SCUnitRepository.registerSCUnitClass("DC", SCUnitDC);

module.exports = SCUnitDC;
