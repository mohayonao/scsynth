"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");
const dspProcess = {};

class SCUnitKlang extends SCUnit {
  initialize(rate) {
    const outf = setCoefs(this, rate);

    this._prep = dspProcess[`prep${ this._numpartials % 4 }`];
    this.dspProcess = dspProcess[`aii`];

    this.outputs[0][0] = outf;
  }
}

function setCoefs(unit, rate) {
  const numpartials = (unit.inputs.length - 2) / 3;
  const numcoefs = 3 * numpartials;
  const coefs = new Float32Array(numcoefs);
  const inputs = unit.inputs;
  const freqscale = inputs[0][0] * rate.radiansPerSample;
  const freqoffset = inputs[1][0] * rate.radiansPerSample;

  let outf = 0;

  for (let i = 0; i < numpartials; i++) {
    const w = inputs[i * 3 + 2][0] * freqscale + freqoffset;
    const level = inputs[i * 3 + 3][0];
    const phase = inputs[i * 3 + 4][0];

    coefs[i * 3] = level * Math.sin(phase);
    coefs[i * 3 + 1] = level * Math.sin(phase - w);
    coefs[i * 3 + 2] = 2 * Math.cos(w);

    outf += coefs[i * 3];
  }

  unit._numpartials = numpartials;
  unit._n = numpartials >> 2;
  unit._coefs = coefs;

  return outf;
}

dspProcess["prep3"] = function(inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;
  const b1_0 = coefs[2];
  const b1_1 = coefs[5];
  const b1_2 = coefs[8];

  let y1_0 = coefs[0];
  let y2_0 = coefs[1];
  let y1_1 = coefs[3];
  let y2_1 = coefs[4];
  let y1_2 = coefs[6];
  let y2_2 = coefs[7];

  for (let i = 0; i < inNumSamples; i++) {
    const y0_0 = b1_0 * y1_0 - y2_0;
    const y0_1 = b1_1 * y1_1 - y2_1;
    const y0_2 = b1_2 * y1_2 - y2_2;

    out[i] = (y0_0 + y0_1 + y0_2);

    y2_0 = y1_0;
    y1_0 = y0_0;
    y2_1 = y1_1;
    y1_1 = y0_1;
    y2_2 = y1_2;
    y1_2 = y0_2;
  }

  coefs[0] = y1_0;
  coefs[1] = y2_0;
  coefs[3] = y1_1;
  coefs[4] = y2_1;
  coefs[6] = y1_2;
  coefs[7] = y2_2;
};

dspProcess["prep2"] = function(inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;
  const b1_0 = coefs[2];
  const b1_1 = coefs[5];

  let y1_0 = coefs[0];
  let y2_0 = coefs[1];
  let y1_1 = coefs[3];
  let y2_1 = coefs[4];

  for (let i = 0; i < inNumSamples; i++) {
    const y0_0 = b1_0 * y1_0 - y2_0;
    const y0_1 = b1_1 * y1_1 - y2_1;

    out[i] = (y0_0 + y0_1);

    y2_0 = y1_0;
    y1_0 = y0_0;
    y2_1 = y1_1;
    y1_1 = y0_1;
  }

  coefs[0] = y1_0;
  coefs[1] = y2_0;
  coefs[3] = y1_1;
  coefs[4] = y2_1;
};

dspProcess["prep1"] = function(inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;
  const b1_0 = coefs[2];

  let y1_0 = coefs[0];
  let y2_0 = coefs[1];

  for (let i = 0; i < inNumSamples; i++) {
    const y0_0 = b1_0 * y1_0 - y2_0;

    out[i] = y0_0;

    y2_0 = y1_0;
    y1_0 = y0_0;
  }

  coefs[0] = y1_0;
  coefs[1] = y2_0;
};

dspProcess["prep0"] = function() {
  fill(this.outputs[0], 0);
};

dspProcess["aii"] = function(inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;

  this._prep(inNumSamples);

  for (let n = 0, nmax = this._n; n < nmax; n++) {
    const b1_0 = coefs[2];
    const b1_1 = coefs[5];
    const b1_2 = coefs[8];
    const b1_3 = coefs[11];

    let y1_0 = coefs[0];
    let y2_0 = coefs[1];
    let y1_1 = coefs[3];
    let y2_1 = coefs[4];
    let y1_2 = coefs[6];
    let y2_2 = coefs[7];
    let y1_3 = coefs[9];
    let y2_3 = coefs[10];

    for (let i = 0; i < inNumSamples; i++) {
      const y0_0 = b1_0 * y1_0 - y2_0;
      const y0_1 = b1_1 * y1_1 - y2_1;
      const y0_2 = b1_2 * y1_2 - y2_2;
      const y0_3 = b1_3 * y1_3 - y2_3;

      out[i] += (y0_0 + y0_1 + y0_2 + y0_3);

      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
    }

    coefs[0] = y1_0;
    coefs[1] = y2_0;
    coefs[3] = y1_1;
    coefs[4] = y2_1;
    coefs[6] = y1_2;
    coefs[7] = y2_2;
    coefs[9] = y1_3;
    coefs[10] = y2_3;
  }
};

SCUnitRepository.registerSCUnitClass("Klang", SCUnitKlang);

module.exports = SCUnitKlang;
