"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

const AMPCOMP_K = 3.5041384 * 10e15;
const AMPCOMP_C1 = 20.598997 * 20.598997;
const AMPCOMP_C2 = 107.65265 * 107.65265;
const AMPCOMP_C3 = 737.86223 * 737.86223;
const AMPCOMP_C4 = 12194.217 * 12194.217;
const AMPCOMP_MINLEVEL = -0.1575371167435;

class SCUnitAmpCompA extends SCUnit {
  initialize() {
    assert(this.inputs.length === 4);
    assert(this.calcRate !== C.RATE_AUDIO || this.inputSpecs[0].rate === C.RATE_AUDIO);

    this.dspProcess = dspProcess["aiii"];

    const rootFreq = this.inputs[1][0];
    const rootLevel = calcLevel(rootFreq);
    const minLevel = this.inputs[2][0];

    this._scale = (this.inputs[3][0] - minLevel) / (rootLevel - AMPCOMP_MINLEVEL);
    this._offset = minLevel - this._scale * AMPCOMP_MINLEVEL;

    this.dspProcess(1);
  }
}

function calcLevel(freq) {
  const r = freq * freq;
  const n1 = AMPCOMP_C1 + r;
  const n2 = AMPCOMP_C4 + r;

  let level = (AMPCOMP_K * r * r * r * r);

  level = level / (n1 * n1 * (AMPCOMP_C2 + r) * (AMPCOMP_C3 + r) * n2 * n2);
  level = 1 - Math.sqrt(level);

  return level;
}

dspProcess["aiii"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const scale = this._scale;
  const offset = this._offset;

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = calcLevel(freqIn[i]) * scale + offset;
  }
};

SCUnitRepository.registerSCUnitClass("AmpCompA", SCUnitAmpCompA);

module.exports = SCUnitAmpCompA;
