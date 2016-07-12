"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");
const dspProcess = {};
const log001 = Math.log(0.001);
class SCUnitKlank extends SCUnit {
  initialize(rate) {
    const numpartials = (this.inputs.length - 4) / 3;
    const numcoefs = (numpartials + 3 & ~3) * 5;
    const coefs = new Float32Array(numcoefs + this.bufferLength);
    const buf = new Float32Array(coefs.buffer, numcoefs * 4);
    const inputs = this.inputs;
    const freqscale = inputs[1][0] * rate.radiansPerSample;
    const freqoffset = inputs[2][0] * rate.radiansPerSample;
    const decayscale = inputs[3][0];
    const sampleRate = rate.sampleRate;
    for (let i = 0, j = 4; i < numpartials; i++) {
      const w = inputs[j++][0] * freqscale + freqoffset;
      const level = inputs[j++][0];
      const time = inputs[j++][0] * decayscale;
      const R = time === 0 ? 0 : Math.exp(log001 / (time * sampleRate));
      const twoR = 2 * R;
      const R2 = R * R;
      const cost = twoR * Math.cos(w) / (1 + R2);
      const k = 20 * (i >> 2) + (i & 3);
      coefs[k] = 0;
      coefs[k + 4] = 0;
      coefs[k + 8] = twoR * cost;
      coefs[k + 12] = -R2;
      coefs[k + 16] = level * 0.25;
    }
    this.dspProcess = dspProcess[`next${ numpartials % 4 }`];
    this._numpartials = numpartials;
    this._n = numpartials >> 2;
    this._coefs = coefs;
    this._buf = buf;
    this._x1 = 0;
    this._x2 = 0;
  }
}
dspProcess["next3"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;
  let inf;
  let y0_0, y1_0, y2_0, a0_0, b1_0, b2_0;
  let y0_1, y1_1, y2_1, a0_1, b1_1, b2_1;
  let y0_2, y1_2, y2_2, a0_2, b1_2, b2_2;
  let y0_3, y1_3, y2_3, a0_3, b1_3, b2_3;
  let k = this._n * 20;
  y1_0 = coefs[k + 0];
  y2_0 = coefs[k + 4];
  b1_0 = coefs[k + 8];
  b2_0 = coefs[k + 12];
  a0_0 = coefs[k + 16];
  y1_1 = coefs[k + 1];
  y2_1 = coefs[k + 5];
  b1_1 = coefs[k + 9];
  b2_1 = coefs[k + 13];
  a0_1 = coefs[k + 17];
  y1_2 = coefs[k + 2];
  y2_2 = coefs[k + 6];
  b1_2 = coefs[k + 10];
  b2_2 = coefs[k + 14];
  a0_2 = coefs[k + 18];
  for (let i = 0; i < inNumSamples; i++) {
    inf = inIn[i];
    y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
    y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
    y0_2 = inf + b1_2 * y1_2 + b2_2 * y2_2;
    buf[i] = a0_0 * y0_0 + a0_1 * y0_1 + a0_2 * y0_2;
    y2_0 = y1_0;
    y1_0 = y0_0;
    y2_1 = y1_1;
    y1_1 = y0_1;
    y2_2 = y1_2;
    y1_2 = y0_2;
  }
  coefs[k + 0] = y1_0;
  coefs[k + 4] = y2_0;
  coefs[k + 1] = y1_1;
  coefs[k + 5] = y2_1;
  coefs[k + 2] = y1_2;
  coefs[k + 6] = y2_2;
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[k + 0];
    y2_0 = coefs[k + 4];
    b1_0 = coefs[k + 8];
    b2_0 = coefs[k + 12];
    a0_0 = coefs[k + 16];
    y1_1 = coefs[k + 1];
    y2_1 = coefs[k + 5];
    b1_1 = coefs[k + 9];
    b2_1 = coefs[k + 13];
    a0_1 = coefs[k + 17];
    y1_2 = coefs[k + 2];
    y2_2 = coefs[k + 6];
    b1_2 = coefs[k + 10];
    b2_2 = coefs[k + 14];
    a0_2 = coefs[k + 18];
    y1_3 = coefs[k + 3];
    y2_3 = coefs[k + 7];
    b1_3 = coefs[k + 11];
    b2_3 = coefs[k + 15];
    a0_3 = coefs[k + 19];
    for (let i = 0; i < inNumSamples; i++) {
      inf = inIn[i];
      y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
      y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
      y0_2 = inf + b1_2 * y1_2 + b2_2 * y2_2;
      y0_3 = inf + b1_3 * y1_3 + b2_3 * y2_3;
      buf[i] += a0_0 * y0_0 + a0_1 * y0_1 + a0_2 * y0_2 + a0_3 * y0_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
    }
    coefs[k + 0] = y1_0;
    coefs[k + 4] = y2_0;
    coefs[k + 1] = y1_1;
    coefs[k + 5] = y2_1;
    coefs[k + 2] = y1_2;
    coefs[k + 6] = y2_2;
    coefs[k + 3] = y1_3;
    coefs[k + 7] = y2_3;
    k += 20;
  }
  let x1 = this._x1;
  let x2 = this._x2;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = buf[i];
    out[i] = x0 - x2;
    x2 = x1;
    x1 = x0;
  }
  this._x1 = x1;
  this._x2 = x2;
};
dspProcess["next2"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;
  let inf;
  let y0_0, y1_0, y2_0, a0_0, b1_0, b2_0;
  let y0_1, y1_1, y2_1, a0_1, b1_1, b2_1;
  let y0_2, y1_2, y2_2, a0_2, b1_2, b2_2;
  let y0_3, y1_3, y2_3, a0_3, b1_3, b2_3;
  let k = this._n * 20;
  y1_0 = coefs[k + 0];
  y2_0 = coefs[k + 4];
  b1_0 = coefs[k + 8];
  b2_0 = coefs[k + 12];
  a0_0 = coefs[k + 16];
  y1_1 = coefs[k + 1];
  y2_1 = coefs[k + 5];
  b1_1 = coefs[k + 9];
  b2_1 = coefs[k + 13];
  a0_1 = coefs[k + 17];
  for (let i = 0; i < inNumSamples; i++) {
    inf = inIn[i];
    y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
    y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
    buf[i] = a0_0 * y0_0 + a0_1 * y0_1;
    y2_0 = y1_0;
    y1_0 = y0_0;
    y2_1 = y1_1;
    y1_1 = y0_1;
  }
  coefs[k + 0] = y1_0;
  coefs[k + 4] = y2_0;
  coefs[k + 1] = y1_1;
  coefs[k + 5] = y2_1;
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[k + 0];
    y2_0 = coefs[k + 4];
    b1_0 = coefs[k + 8];
    b2_0 = coefs[k + 12];
    a0_0 = coefs[k + 16];
    y1_1 = coefs[k + 1];
    y2_1 = coefs[k + 5];
    b1_1 = coefs[k + 9];
    b2_1 = coefs[k + 13];
    a0_1 = coefs[k + 17];
    y1_2 = coefs[k + 2];
    y2_2 = coefs[k + 6];
    b1_2 = coefs[k + 10];
    b2_2 = coefs[k + 14];
    a0_2 = coefs[k + 18];
    y1_3 = coefs[k + 3];
    y2_3 = coefs[k + 7];
    b1_3 = coefs[k + 11];
    b2_3 = coefs[k + 15];
    a0_3 = coefs[k + 19];
    for (let i = 0; i < inNumSamples; i++) {
      inf = inIn[i];
      y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
      y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
      y0_2 = inf + b1_2 * y1_2 + b2_2 * y2_2;
      y0_3 = inf + b1_3 * y1_3 + b2_3 * y2_3;
      buf[i] += a0_0 * y0_0 + a0_1 * y0_1 + a0_2 * y0_2 + a0_3 * y0_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
    }
    coefs[k + 0] = y1_0;
    coefs[k + 4] = y2_0;
    coefs[k + 1] = y1_1;
    coefs[k + 5] = y2_1;
    coefs[k + 2] = y1_2;
    coefs[k + 6] = y2_2;
    coefs[k + 3] = y1_3;
    coefs[k + 7] = y2_3;
    k += 20;
  }
  let x1 = this._x1;
  let x2 = this._x2;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = buf[i];
    out[i] = x0 - x2;
    x2 = x1;
    x1 = x0;
  }
  this._x1 = x1;
  this._x2 = x2;
};
dspProcess["next1"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;
  let inf;
  let y0_0, y1_0, y2_0, a0_0, b1_0, b2_0;
  let y0_1, y1_1, y2_1, a0_1, b1_1, b2_1;
  let y0_2, y1_2, y2_2, a0_2, b1_2, b2_2;
  let y0_3, y1_3, y2_3, a0_3, b1_3, b2_3;
  let k = this._n * 20;
  y1_0 = coefs[k + 0];
  y2_0 = coefs[k + 4];
  b1_0 = coefs[k + 8];
  b2_0 = coefs[k + 12];
  a0_0 = coefs[k + 16];
  for (let i = 0; i < inNumSamples; i++) {
    inf = inIn[i];
    y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
    buf[i] = a0_0 * y0_0;
    y2_0 = y1_0;
    y1_0 = y0_0;
  }
  coefs[k + 0] = y1_0;
  coefs[k + 4] = y2_0;
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[k + 0];
    y2_0 = coefs[k + 4];
    b1_0 = coefs[k + 8];
    b2_0 = coefs[k + 12];
    a0_0 = coefs[k + 16];
    y1_1 = coefs[k + 1];
    y2_1 = coefs[k + 5];
    b1_1 = coefs[k + 9];
    b2_1 = coefs[k + 13];
    a0_1 = coefs[k + 17];
    y1_2 = coefs[k + 2];
    y2_2 = coefs[k + 6];
    b1_2 = coefs[k + 10];
    b2_2 = coefs[k + 14];
    a0_2 = coefs[k + 18];
    y1_3 = coefs[k + 3];
    y2_3 = coefs[k + 7];
    b1_3 = coefs[k + 11];
    b2_3 = coefs[k + 15];
    a0_3 = coefs[k + 19];
    for (let i = 0; i < inNumSamples; i++) {
      inf = inIn[i];
      y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
      y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
      y0_2 = inf + b1_2 * y1_2 + b2_2 * y2_2;
      y0_3 = inf + b1_3 * y1_3 + b2_3 * y2_3;
      buf[i] += a0_0 * y0_0 + a0_1 * y0_1 + a0_2 * y0_2 + a0_3 * y0_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
    }
    coefs[k + 0] = y1_0;
    coefs[k + 4] = y2_0;
    coefs[k + 1] = y1_1;
    coefs[k + 5] = y2_1;
    coefs[k + 2] = y1_2;
    coefs[k + 6] = y2_2;
    coefs[k + 3] = y1_3;
    coefs[k + 7] = y2_3;
    k += 20;
  }
  let x1 = this._x1;
  let x2 = this._x2;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = buf[i];
    out[i] = x0 - x2;
    x2 = x1;
    x1 = x0;
  }
  this._x1 = x1;
  this._x2 = x2;
};
dspProcess["next0"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;
  let inf;
  let y0_0, y1_0, y2_0, a0_0, b1_0, b2_0;
  let y0_1, y1_1, y2_1, a0_1, b1_1, b2_1;
  let y0_2, y1_2, y2_2, a0_2, b1_2, b2_2;
  let y0_3, y1_3, y2_3, a0_3, b1_3, b2_3;
  let k = this._n * 20;
  fill(buf, 0);
  for (let n = 0, nmax = this._n; n < nmax; n++) {
    y1_0 = coefs[k + 0];
    y2_0 = coefs[k + 4];
    b1_0 = coefs[k + 8];
    b2_0 = coefs[k + 12];
    a0_0 = coefs[k + 16];
    y1_1 = coefs[k + 1];
    y2_1 = coefs[k + 5];
    b1_1 = coefs[k + 9];
    b2_1 = coefs[k + 13];
    a0_1 = coefs[k + 17];
    y1_2 = coefs[k + 2];
    y2_2 = coefs[k + 6];
    b1_2 = coefs[k + 10];
    b2_2 = coefs[k + 14];
    a0_2 = coefs[k + 18];
    y1_3 = coefs[k + 3];
    y2_3 = coefs[k + 7];
    b1_3 = coefs[k + 11];
    b2_3 = coefs[k + 15];
    a0_3 = coefs[k + 19];
    for (let i = 0; i < inNumSamples; i++) {
      inf = inIn[i];
      y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
      y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
      y0_2 = inf + b1_2 * y1_2 + b2_2 * y2_2;
      y0_3 = inf + b1_3 * y1_3 + b2_3 * y2_3;
      buf[i] += a0_0 * y0_0 + a0_1 * y0_1 + a0_2 * y0_2 + a0_3 * y0_3;
      y2_0 = y1_0;
      y1_0 = y0_0;
      y2_1 = y1_1;
      y1_1 = y0_1;
      y2_2 = y1_2;
      y1_2 = y0_2;
      y2_3 = y1_3;
      y1_3 = y0_3;
    }
    coefs[k + 0] = y1_0;
    coefs[k + 4] = y2_0;
    coefs[k + 1] = y1_1;
    coefs[k + 5] = y2_1;
    coefs[k + 2] = y1_2;
    coefs[k + 6] = y2_2;
    coefs[k + 3] = y1_3;
    coefs[k + 7] = y2_3;
    k += 20;
  }
  let x1 = this._x1;
  let x2 = this._x2;
  for (let i = 0; i < inNumSamples; i++) {
    const x0 = buf[i];
    out[i] = x0 - x2;
    x2 = x1;
    x1 = x0;
  }
  this._x1 = x1;
  this._x2 = x2;
};
SCUnitRepository.registerSCUnitClass("Klank", SCUnitKlank);
module.exports = SCUnitKlank;
