"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
class SCUnitKlang extends SCUnit {
  initialize(rate) {
    const numpartials = (this.numInputs - 2) / 3;
    const numcoefs = numpartials * 3;
    const coefs = new Float32Array(numcoefs);
    const inputs = this.inputs;
    const freqscale = inputs[0][0] * rate.radiansPerSample;
    const freqoffset = inputs[1][0] * rate.radiansPerSample;
    let outf = 0;
    for (let i = 0, j = 2, k = -1; i < numpartials; i++) {
      const w = inputs[j++][0] * freqscale + freqoffset;
      const level = inputs[j++][0];
      const phase = inputs[j++][0];
      if (phase !== 0) {
        outf += coefs[++k] = level * Math.sin(phase);
        coefs[++k] = level * Math.sin(phase - w);
      } else {
        outf += coefs[++k] = 0;
        coefs[++k] = level * -Math.sin(w);
      }
      coefs[++k] = 2 * Math.cos(w);
    }
    this.dspProcess = dspProcess[`next${ numpartials % 4 }`];
    this._coefs = coefs;
    this._n = numpartials >> 2;
    this.outputs[0][0] = outf;
  }
}
dspProcess["next3"] = function (inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;
  let y0_0, y1_0, y2_0, b1_0;
  let y0_1, y1_1, y2_1, b1_1;
  let y0_2, y1_2, y2_2, b1_2;
  let y0_3, y1_3, y2_3, b1_3;
  let outf;
  y1_0 = coefs[0];
  y2_0 = coefs[1];
  b1_0 = coefs[2];
  y1_1 = coefs[3];
  y2_1 = coefs[4];
  b1_1 = coefs[5];
  y1_2 = coefs[6];
  y2_2 = coefs[7];
  b1_2 = coefs[8];
  for (let i = 0; i < inNumSamples; i++) {
    outf = y0_0 = b1_0 * y1_0 - y2_0;
    outf += y0_1 = b1_1 * y1_1 - y2_1;
    outf += y0_2 = b1_2 * y1_2 - y2_2;
    y2_0 = y1_0;
    y1_0 = y0_0;
    y2_1 = y1_1;
    y1_1 = y0_1;
    y2_2 = y1_2;
    y1_2 = y0_2;
    out[i] = outf;
  }
  coefs[0] = y1_0;
  coefs[1] = y2_0;
  coefs[3] = y1_1;
  coefs[4] = y2_1;
  coefs[6] = y1_2;
  coefs[7] = y2_2;
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[0];
    y2_0 = coefs[1];
    b1_0 = coefs[2];
    y1_1 = coefs[3];
    y2_1 = coefs[4];
    b1_1 = coefs[5];
    y1_2 = coefs[6];
    y2_2 = coefs[7];
    b1_2 = coefs[8];
    y1_3 = coefs[9];
    y2_3 = coefs[10];
    b1_3 = coefs[11];
    for (let i = 0; i < inNumSamples; i++) {
      outf = y0_0 = b1_0 * y1_0 - y2_0;
      outf += y0_1 = b1_1 * y1_1 - y2_1;
      outf += y0_2 = b1_2 * y1_2 - y2_2;
      outf += y0_3 = b1_3 * y1_3 - y2_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
      out[i] += outf;
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
dspProcess["next2"] = function (inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;
  let y0_0, y1_0, y2_0, b1_0;
  let y0_1, y1_1, y2_1, b1_1;
  let y0_2, y1_2, y2_2, b1_2;
  let y0_3, y1_3, y2_3, b1_3;
  let outf;
  y1_0 = coefs[0];
  y2_0 = coefs[1];
  b1_0 = coefs[2];
  y1_1 = coefs[3];
  y2_1 = coefs[4];
  b1_1 = coefs[5];
  for (let i = 0; i < inNumSamples; i++) {
    outf = y0_0 = b1_0 * y1_0 - y2_0;
    outf += y0_1 = b1_1 * y1_1 - y2_1;
    y2_0 = y1_0;
    y1_0 = y0_0;
    y2_1 = y1_1;
    y1_1 = y0_1;
    out[i] = outf;
  }
  coefs[0] = y1_0;
  coefs[1] = y2_0;
  coefs[3] = y1_1;
  coefs[4] = y2_1;
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[0];
    y2_0 = coefs[1];
    b1_0 = coefs[2];
    y1_1 = coefs[3];
    y2_1 = coefs[4];
    b1_1 = coefs[5];
    y1_2 = coefs[6];
    y2_2 = coefs[7];
    b1_2 = coefs[8];
    y1_3 = coefs[9];
    y2_3 = coefs[10];
    b1_3 = coefs[11];
    for (let i = 0; i < inNumSamples; i++) {
      outf = y0_0 = b1_0 * y1_0 - y2_0;
      outf += y0_1 = b1_1 * y1_1 - y2_1;
      outf += y0_2 = b1_2 * y1_2 - y2_2;
      outf += y0_3 = b1_3 * y1_3 - y2_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
      out[i] += outf;
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
dspProcess["next1"] = function (inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;
  let y0_0, y1_0, y2_0, b1_0;
  let y0_1, y1_1, y2_1, b1_1;
  let y0_2, y1_2, y2_2, b1_2;
  let y0_3, y1_3, y2_3, b1_3;
  let outf;
  y1_0 = coefs[0];
  y2_0 = coefs[1];
  b1_0 = coefs[2];
  for (let i = 0; i < inNumSamples; i++) {
    outf = y0_0 = b1_0 * y1_0 - y2_0;
    y2_0 = y1_0;
    y1_0 = y0_0;
    out[i] = outf;
  }
  coefs[0] = y1_0;
  coefs[1] = y2_0;
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[0];
    y2_0 = coefs[1];
    b1_0 = coefs[2];
    y1_1 = coefs[3];
    y2_1 = coefs[4];
    b1_1 = coefs[5];
    y1_2 = coefs[6];
    y2_2 = coefs[7];
    b1_2 = coefs[8];
    y1_3 = coefs[9];
    y2_3 = coefs[10];
    b1_3 = coefs[11];
    for (let i = 0; i < inNumSamples; i++) {
      outf = y0_0 = b1_0 * y1_0 - y2_0;
      outf += y0_1 = b1_1 * y1_1 - y2_1;
      outf += y0_2 = b1_2 * y1_2 - y2_2;
      outf += y0_3 = b1_3 * y1_3 - y2_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
      out[i] += outf;
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
dspProcess["next0"] = function (inNumSamples) {
  const out = this.outputs[0];
  const coefs = this._coefs;
  let y0_0, y1_0, y2_0, b1_0;
  let y0_1, y1_1, y2_1, b1_1;
  let y0_2, y1_2, y2_2, b1_2;
  let y0_3, y1_3, y2_3, b1_3;
  let outf;
  out.fill(0);
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[0];
    y2_0 = coefs[1];
    b1_0 = coefs[2];
    y1_1 = coefs[3];
    y2_1 = coefs[4];
    b1_1 = coefs[5];
    y1_2 = coefs[6];
    y2_2 = coefs[7];
    b1_2 = coefs[8];
    y1_3 = coefs[9];
    y2_3 = coefs[10];
    b1_3 = coefs[11];
    for (let i = 0; i < inNumSamples; i++) {
      outf = y0_0 = b1_0 * y1_0 - y2_0;
      outf += y0_1 = b1_1 * y1_1 - y2_1;
      outf += y0_2 = b1_2 * y1_2 - y2_2;
      outf += y0_3 = b1_3 * y1_3 - y2_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
      out[i] += outf;
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
