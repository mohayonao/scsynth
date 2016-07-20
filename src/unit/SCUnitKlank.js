"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const fill = require("../util/fill");
const dspProcess = {};

const BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT;
const log001 = Math.log(0.001);

class SCUnitKlank extends SCUnit {
  initialize(rate) {
    setCoefs(this, rate);

    this._prep = dspProcess[`prep${ this._numpartials % 4 }`];
    this.dspProcess = dspProcess[`aiii`];

    this._x1 = 0;
    this._x2 = 0;
  }
}

function setCoefs(unit, rate) {
  const numpartials = Math.floor((unit.inputs.length - 4) / 3);
  const numcoefs = 20 * Math.ceil(numpartials / 4);
  const coefs = new Float32Array(numcoefs + rate.bufferLength);
  const buf = new Float32Array(coefs.buffer, numcoefs * BYTES_PER_ELEMENT);
  const inputs = unit.inputs;
  const freqscale = inputs[1][0] * rate.radiansPerSample;
  const freqoffset = inputs[2][0] * rate.radiansPerSample;
  const decayscale = inputs[3][0];
  const sampleRate = rate.sampleRate;

  for (let i = 0, j = 4; i < numpartials; i++, j+=3) {
    const w = inputs[j][0] * freqscale + freqoffset;
    const level = inputs[j + 1][0];
    const time = inputs[j + 2][0] * decayscale;
    const R = time ? Math.exp(log001 / (time * sampleRate)) : 0;
    const twoR = 2 * R;
    const R2 = R * R;
    const cost = (twoR * Math.cos(w)) / (1 + R2);
    const k = 20 * (i >> 2) + (i & 3);

    coefs[k] = 0;
    coefs[k + 4] = 0;
    coefs[k + 8] = twoR * cost;
    coefs[k + 12] = -R2;
    coefs[k + 16] = level * 0.25;
  }

  unit._numpartials = numpartials;
  unit._n = numpartials >> 2;
  unit._coefs = coefs;
  unit._buf = buf;
}

dspProcess["prep3"] = function(inNumSamples) {
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;
  const k = this._n * 20;
  const b1_0 = coefs[k + 8];
  const b2_0 = coefs[k + 12];
  const a0_0 = coefs[k + 16];
  const b1_1 = coefs[k + 9];
  const b2_1 = coefs[k + 13];
  const a0_1 = coefs[k + 17];
  const b1_2 = coefs[k + 10];
  const b2_2 = coefs[k + 14];
  const a0_2 = coefs[k + 18];

  let y1_0 = coefs[k + 0];
  let y2_0 = coefs[k + 4];
  let y1_1 = coefs[k + 1];
  let y2_1 = coefs[k + 5];
  let y1_2 = coefs[k + 2];
  let y2_2 = coefs[k + 6];

  for (let i = 0; i < inNumSamples; i++) {
    const inf = inIn[i];
    const y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
    const y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
    const y0_2 = inf + b1_2 * y1_2 + b2_2 * y2_2;

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
};

dspProcess["prep2"] = function(inNumSamples) {
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;
  const k = this._n * 20;
  const b1_0 = coefs[k + 8];
  const b2_0 = coefs[k + 12];
  const a0_0 = coefs[k + 16];
  const b1_1 = coefs[k + 9];
  const b2_1 = coefs[k + 13];
  const a0_1 = coefs[k + 17];

  let y1_0 = coefs[k + 0];
  let y2_0 = coefs[k + 4];
  let y1_1 = coefs[k + 1];
  let y2_1 = coefs[k + 5];

  for (let i = 0; i < inNumSamples; i++) {
    const inf = inIn[i];
    const y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
    const y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;

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
};

dspProcess["prep1"] = function(inNumSamples) {
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;
  const k = this._n * 20;
  const b1_0 = coefs[k + 8];
  const b2_0 = coefs[k + 12];
  const a0_0 = coefs[k + 16];

  let y1_0 = coefs[k + 0];
  let y2_0 = coefs[k + 4];

  for (let i = 0; i < inNumSamples; i++) {
    const inf = inIn[i];
    const y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;

    buf[i] = a0_0 * y0_0;

    y2_0 = y1_0;
    y1_0 = y0_0;
  }

  coefs[k + 0] = y1_0;
  coefs[k + 4] = y2_0;
};

dspProcess["prep0"] = function() {
  fill(this._buf, 0);
};

dspProcess["aiii"] = function (inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const coefs = this._coefs;
  const buf = this._buf;

  this._prep();

  for (let n = 0, nmax = this._n; n < nmax; n++) {
    const k = n * 20;
    const b1_0 = coefs[k + 8];
    const b2_0 = coefs[k + 12];
    const a0_0 = coefs[k + 16];
    const b1_1 = coefs[k + 9];
    const b2_1 = coefs[k + 13];
    const a0_1 = coefs[k + 17];
    const b1_2 = coefs[k + 10];
    const b2_2 = coefs[k + 14];
    const a0_2 = coefs[k + 18];
    const b1_3 = coefs[k + 11];
    const b2_3 = coefs[k + 15];
    const a0_3 = coefs[k + 19];

    let y1_0 = coefs[k + 0];
    let y2_0 = coefs[k + 4];
    let y1_1 = coefs[k + 1];
    let y2_1 = coefs[k + 5];
    let y1_2 = coefs[k + 2];
    let y2_2 = coefs[k + 6];
    let y1_3 = coefs[k + 3];
    let y2_3 = coefs[k + 7];

    for (let i = 0; i < inNumSamples; i++) {
      const inf = inIn[i];
      const y0_0 = inf + b1_0 * y1_0 + b2_0 * y2_0;
      const y0_1 = inf + b1_1 * y1_1 + b2_1 * y2_1;
      const y0_2 = inf + b1_2 * y1_2 + b2_2 * y2_2;
      const y0_3 = inf + b1_3 * y1_3 + b2_3 * y2_3;

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
