"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const sine = require("./_sine");
const numtbl = sine.gSine;
const dentbl = sine.gInvSine;
const kBadValue = sine.kBadValue;
const kSineSize = sine.kSineSize;
const kSineMask = sine.kSineMask;
class SCUnitSaw extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess["next"];
    this._sampleRate = rate.sampleRate;
    this._slopeFactor = rate.slopeFactor;
    this._freq = this.inputs[0][0];
    this._cpstoinc = kSineSize * rate.sampleDur * 0.5;
    this._N = Math.max(1, rate.sampleRate * 0.5 / this._freq | 0);
    this._mask = kSineMask;
    this._scale = 0.5 / this._N;
    this._phase = 0;
    this._y1 = -0.46;
    this.dspProcess(1);
  }
}
dspProcess["next"] = function (inNumSamples) {
  const out = this.outputs[0];
  const mask = this._mask;
  let freq = this.inputs[0][0];
  let phase = this._phase;
  let y1 = this._y1;
  let N, N2, prevN, prevN2, scale, prevScale, crossfade;
  let tblIndex, t0, t1, pfrac, denom, rphase, numer, n1, n2;
  let xfade, xfade_slope;
  if (freq !== this._freq) {
    N = Math.max(1, this._sampleRate * 0.5 / freq | 0);
    if (N !== this._N) {
      freq = this._cpstoinc * Math.max(this._freq, freq);
      crossfade = true;
    } else {
      freq = this._cpstoinc * freq;
      crossfade = false;
    }
    prevN = this._N;
    prevScale = this._scale;
    this._N = N;
    this._scale = scale = 0.5 / N;
  } else {
    N = this._N;
    freq = this._cpstoinc * freq;
    scale = this._scale;
    crossfade = false;
  }
  N2 = 2 * N + 1;
  if (crossfade) {
    prevN2 = 2 * prevN + 1;
    xfade_slope = this._slopeFactor;
    xfade = 0;
    for (let i = 0; i < inNumSamples; i++) {
      tblIndex = phase & mask;
      t0 = dentbl[tblIndex];
      t1 = dentbl[tblIndex + 1];
      if (t0 === kBadValue || t1 === kBadValue) {
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        pfrac = phase - (phase | 0);
        denom = t0 + (t1 - t0) * pfrac;
        if (Math.abs(denom) < 0.0005) {
          out[i] = y1 = 1 + 0.999 * y1;
        } else {
          rphase = phase * prevN2;
          pfrac = rphase - (rphase | 0);
          tblIndex = rphase & mask;
          t0 = numtbl[tblIndex];
          t1 = numtbl[tblIndex + 1];
          numer = t0 + (t1 - t0) * pfrac;
          n1 = (numer / denom - 1) * prevScale;
          rphase = phase * N2;
          pfrac = rphase - (rphase | 0);
          tblIndex = rphase & mask;
          t0 = numtbl[tblIndex];
          t1 = numtbl[tblIndex + 1];
          numer = t0 + (t1 - t0) * pfrac;
          n2 = (numer / denom - 1) * scale;
          out[i] = y1 = n1 + xfade * (n2 - n1) + 0.999 * y1;
        }
      } else {
        pfrac = phase - (phase | 0);
        denom = t0 + (t1 - t0) * pfrac;
        rphase = phase * prevN2;
        pfrac = rphase - (rphase | 0);
        tblIndex = rphase & mask;
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        numer = t0 + (t1 - t0) * pfrac;
        n1 = (numer * denom - 1) * prevScale;
        rphase = phase * N2;
        pfrac = rphase - (rphase | 0);
        tblIndex = rphase & mask;
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        numer = t0 + (t1 - t0) * pfrac;
        n2 = (numer * denom - 1) * scale;
        out[i] = y1 = n1 + xfade * (n2 - n1) + 0.999 * y1;
      }
      phase += freq;
      xfade += xfade_slope;
    }
  } else {
    for (let i = 0; i < inNumSamples; i++) {
      tblIndex = phase & mask;
      t0 = dentbl[tblIndex];
      t1 = dentbl[tblIndex + 1];
      if (t0 === kBadValue || t1 === kBadValue) {
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        pfrac = phase - (phase | 0);
        denom = t0 + (t1 - t0) * pfrac;
        if (Math.abs(denom) < 0.0005) {
          out[i] = y1 = 1 + 0.999 * y1;
        } else {
          rphase = phase * N2;
          pfrac = rphase - (rphase | 0);
          tblIndex = rphase & mask;
          t0 = numtbl[tblIndex];
          t1 = numtbl[tblIndex + 1];
          numer = t0 + (t1 - t0) * pfrac;
          out[i] = y1 = (numer / denom - 1) * scale + 0.999 * y1;
        }
      } else {
        pfrac = phase - (phase | 0);
        denom = t0 + (t1 - t0) * pfrac;
        rphase = phase * N2;
        pfrac = rphase - (rphase | 0);
        tblIndex = rphase & mask;
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        numer = t0 + (t1 - t0) * pfrac;
        out[i] = y1 = (numer * denom - 1) * scale + 0.999 * y1;
      }
      phase += freq;
    }
  }
  if (phase >= 65536) {
    phase -= 65536;
  }
  this._y1 = y1;
  this._phase = phase;
  this._freq = this.inputs[0][0];
};
SCUnitRepository.registerSCUnitClass("Saw", SCUnitSaw);
module.exports = SCUnitSaw;
