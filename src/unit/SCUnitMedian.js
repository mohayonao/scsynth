"use strict";

const assert = require("assert");
const nmap = require("nmap");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const clamp = require("../util/clamp");
const dspProcess = {};

const kMAXMEDIANSIZE = 31;

class SCUnitMedian extends SCUnit {
  initialize() {
    assert(this.inputs.length === 2);

    this.dspProcess = dspProcess["ia"];

    let medianSize = clamp(this.inputs[0][0]|0, 3, kMAXMEDIANSIZE);

    if (medianSize % 2 === 0) {
      medianSize += 1;
    }

    const _in = this.inputs[1][0];

    this._medianSize = medianSize;
    this._medialVal = new Float32Array(nmap(medianSize, () => _in));
    this._medianAge = new Uint8Array(nmap(medianSize, (_, i) => i));

    this.outputs[0][0] = _in;
  }
}

function computeMedian(unit, value) {
  const medianSize = unit._medianSize;
  const medialVal = unit._medialVal;
  const medianAge = unit._medianAge;
  const last = medianSize - 1;

  let pos = -1;

  for (let i = 0; i < medianSize; i++) {
    if (medianAge[i] === last) {
      pos = i;
    } else {
      medianAge[i] += 1;
    }
  }

  while (1 <= pos && value < medialVal[pos - 1]) {
    medialVal[pos] = medialVal[pos - 1];
    medianAge[pos] = medianAge[pos - 1];
    pos -= 1;
  }

  while (pos < last && medialVal[pos + 1] < value) {
    medialVal[pos] = medialVal[pos + 1];
    medianAge[pos] = medianAge[pos + 1];
    pos += 1;
  }

  medialVal[pos] = value;
  medianAge[pos] = 0;

  return medialVal[medianSize >> 1];
}

dspProcess["ia"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[1];

  for (let i = 0; i < inNumSamples; i++) {
    out[i] = computeMedian(this, inIn[i]);
  }
};

SCUnitRepository.registerSCUnitClass("Median", SCUnitMedian);

module.exports = SCUnitMedian;
