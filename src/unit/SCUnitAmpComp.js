"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitAmpComp extends SCUnit {
  initialize() {
    assert(this.inputs.length === 3);
    assert(this.calcRate !== C.RATE_AUDIO || this.inputSpecs[0].rate === C.RATE_AUDIO);

    if (this.inputSpecs[1].rate === C.RATE_SCALAR && this.inputSpecs[2].rate === C.RATE_SCALAR) {
      this.dspProcess = dspProcess["aii"];

      const exp = this.inputs[2][0];

      this._rootmul = Math.pow(this.inputs[1][0], exp) || 0;
      this._exponent = -1 * exp;
    } else {
      this.dspProcess = dspProcess["akk"];
    }

    this.dspProcess(1);
  }
}

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const root = this.inputs[1][0];
  const xb = this.inputs[2][0];

  for (let i = 0; i < inNumSamples; i++) {
    const xa = (root / freqIn[i]);

    out[i] = xa >= 0 ? Math.pow(xa, xb) : -Math.pow(-xa, xb);
  }
};

dspProcess["aii"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const rootmul = this._rootmul;
  const xb = this._exponent;

  for (let i = 0; i < inNumSamples; i++) {
    const xa = freqIn[i];

    out[i] = (xa >= 0 ? Math.pow(xa, xb) : -Math.pow(-xa, xb)) * rootmul;
  }
};

SCUnitRepository.registerSCUnitClass("AmpComp", SCUnitAmpComp);

module.exports = SCUnitAmpComp;
