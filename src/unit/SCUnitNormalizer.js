"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitNormalizer extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 3);

    this.dspProcess = dspProcess["aki"];

    const dur = Math.max(rate.bufferDuration, this.inputs[2][0]);
    const bufSize = Math.ceil(dur * rate.sampleRate);

    this._bufSize = bufSize;
    this._pos = 0;
    this._flips = 0;
    this._level = 1;
    this._level_slope = 0;
    this._prevmaxval = 0;
    this._curmaxval = 0;
    this._slopeFactor = 1 / bufSize;
    this._xinbuf = new Float32Array(bufSize);
    this._xmidbuf = new Float32Array(bufSize);
    this._xoutbuf = new Float32Array(bufSize);
  }
}

dspProcess["aki"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const amp = this.inputs[1][0];
  const bufSize = this._bufSize;

  let level = this._level;
  let pos = this._pos;
  let next_level = this._level;
  let level_slope = this._level_slope;
  let curmaxval = this._curmaxval;

  let bufRemain = bufSize - pos;
  let remain = inNumSamples;
  let val, j = 0;

  while (remain) {
    const nsmps = Math.min(remain, bufRemain);
    const xinbuf = this._xinbuf;
    const xoutbuf = this._xoutbuf;

    if (2 <= this._flips) {
      for (let i = 0; i < nsmps; i++) {
        const x = level * xoutbuf[pos + j];
        xinbuf[pos + j] = val = inIn[j];
        out[j++] = x;
        level += level_slope;
        curmaxval = Math.max(curmaxval, Math.abs(val));
      }
    } else {
      for (let i = 0; i < nsmps; i++) {
        xinbuf[pos + j] = val = inIn[j];
        out[j++] = 0;
        curmaxval = Math.max(curmaxval, Math.abs(val));
      }
    }

    pos += nsmps;

    if (bufSize <= pos) {
      pos = 0;
      bufRemain = bufSize;

      const maxval2 = Math.max(this._prevmaxval, curmaxval, 0.00001);

      this._prevmaxval = curmaxval;
      this._curmaxval = curmaxval = 0;

      next_level = amp / maxval2;
      level_slope = (next_level - level) * this._slopeFactor;

      [
        this._xoutbuf, this._xmidbuf, this._xinbuf
      ] = [
        this._xmidbuf, this._xinbuf, this._xoutbuf
      ];

      this._flips += 1;
    }

    remain -= nsmps;
  }

  this._pos = pos;
  this._level = level;
  this._level_slope = level_slope;
  this._curmaxval = curmaxval;
};

SCUnitRepository.registerSCUnitClass("Normalizer", SCUnitNormalizer);

module.exports = SCUnitNormalizer;
