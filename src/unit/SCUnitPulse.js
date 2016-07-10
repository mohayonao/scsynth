"use strict";
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const sine = require("./_sine");
const gSine = sine.gSine;
const gInvSine = sine.gInvSine;
const kSineSize = sine.kSineSize;
const kSineMask = sine.kSineMask;
const kBadValue = sine.kBadValue;
class SCUnitPulse extends SCUnit {
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
    this._duty = 0;
    this._y1 = 0;
  }
}
dspProcess["next"] = function (inNumSamples) {
  let out = this.outputs[0];
  let freq = this.inputs[0][0];
  let duty = this._duty;
  let phase = this._phase;
  let y1 = this._y1;
  let mask = this._mask;
  let numtbl = gSine, dentbl = gInvSine;
  let N, N2, prevN, prevN2, scale, prevScale, crossfade;
  let tblIndex, t0, t1, pfrac, denom, rphase, numer, n1, n2;
  let phase2, nextDuty, duty_slope, rscale, pul1, pul2;
  let i, xfade, xfade_slope;
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
  nextDuty = this.inputs[1][0];
  duty_slope = (nextDuty - duty) * this._slopeFactor;
  rscale = 1 / scale + 1;
  if (crossfade) {
    prevN2 = 2 * prevN + 1;
    xfade_slope = this._slopeFactor;
    xfade = 0;
    for (i = 0; i < inNumSamples; i++) {
      tblIndex = phase & mask;
      t0 = dentbl[tblIndex];
      t1 = dentbl[tblIndex + 1];
      if (t0 === kBadValue || t1 === kBadValue) {
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        pfrac = phase - (phase | 0);
        denom = t0 + (t1 - t0) * pfrac;
        if (Math.abs(denom) < 0.0005) {
          pul1 = 1;
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
          pul1 = n1 + xfade * (n2 - n1);
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
        pul1 = n1 + xfade * (n2 - n1);
      }
      phase2 = phase + duty * kSineSize * 0.5;
      tblIndex = phase2 & mask;
      t0 = dentbl[tblIndex];
      t1 = dentbl[tblIndex + 1];
      if (t0 === kBadValue || t1 === kBadValue) {
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        pfrac = phase2 - (phase2 | 0);
        denom = t0 + (t1 - t0) * pfrac;
        if (Math.abs(denom) < 0.0005) {
          pul2 = 1;
        } else {
          rphase = phase2 * prevN2;
          pfrac = rphase - (rphase | 0);
          tblIndex = rphase & mask;
          t0 = numtbl[tblIndex];
          t1 = numtbl[tblIndex + 1];
          numer = t0 + (t1 - t0) * pfrac;
          n1 = (numer / denom - 1) * prevScale;
          rphase = phase2 * N2;
          pfrac = rphase - (rphase | 0);
          tblIndex = rphase & mask;
          t0 = numtbl[tblIndex];
          t1 = numtbl[tblIndex + 1];
          numer = t0 + (t1 - t0) * pfrac;
          n2 = (numer / denom - 1) * scale;
          pul2 = n1 + xfade * (n2 - n1);
        }
      } else {
        pfrac = phase2 - (phase2 | 0);
        denom = t0 + (t1 - t0) * pfrac;
        rphase = phase2 * prevN2;
        pfrac = rphase - (rphase | 0);
        tblIndex = rphase & mask;
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        numer = t0 + (t1 - t0) * pfrac;
        n1 = (numer * denom - 1) * prevScale;
        rphase = phase2 * N2;
        pfrac = rphase - (rphase | 0);
        tblIndex = rphase & mask;
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        numer = t0 + (t1 - t0) * pfrac;
        n2 = (numer * denom - 1) * scale;
        pul2 = n1 + xfade * (n2 - n1);
      }
      out[i] = y1 = pul1 - pul2 + 0.999 * y1;
      phase += freq;
      duty += duty_slope;
      xfade += xfade_slope;
    }
  } else {
    for (i = 0; i < inNumSamples; i++) {
      tblIndex = phase & mask;
      t0 = dentbl[tblIndex];
      t1 = dentbl[tblIndex + 1];
      if (t0 === kBadValue || t1 === kBadValue) {
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        pfrac = phase - (phase | 0);
        denom = t0 + (t1 - t0) * pfrac;
        if (Math.abs(denom) < 0.0005) {
          pul1 = rscale;
        } else {
          rphase = phase * N2;
          pfrac = rphase - (rphase | 0);
          tblIndex = rphase & mask;
          t0 = numtbl[tblIndex];
          t1 = numtbl[tblIndex + 1];
          numer = t0 + (t1 - t0) * pfrac;
          pul1 = numer / denom;
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
        pul1 = numer * denom;
      }
      phase2 = phase + duty * kSineSize * 0.5;
      tblIndex = phase2 & mask;
      t0 = dentbl[tblIndex];
      t1 = dentbl[tblIndex + 1];
      if (t0 === kBadValue || t1 === kBadValue) {
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        pfrac = phase2 - (phase2 | 0);
        denom = t0 + (t1 - t0) * pfrac;
        if (Math.abs(denom) < 0.0005) {
          pul2 = rscale;
        } else {
          rphase = phase2 * N2;
          pfrac = rphase - (rphase | 0);
          tblIndex = rphase & mask;
          t0 = numtbl[tblIndex];
          t1 = numtbl[tblIndex + 1];
          numer = t0 + (t1 - t0) * pfrac;
          pul2 = numer / denom;
        }
      } else {
        pfrac = phase2 - (phase2 | 0);
        denom = t0 + (t1 - t0) * pfrac;
        rphase = phase2 * N2;
        pfrac = rphase - (rphase | 0);
        tblIndex = rphase & mask;
        t0 = numtbl[tblIndex];
        t1 = numtbl[tblIndex + 1];
        numer = t0 + (t1 - t0) * pfrac;
        pul2 = numer * denom;
      }
      out[i] = y1 = (pul1 - pul2) * scale + 0.999 * y1;
      phase += freq;
      duty += duty_slope;
    }
  }
  if (phase >= 65536) {
    phase -= 65536;
  }
  this._y1 = y1;
  this._phase = phase;
  this._freq = this.inputs[0][0];
  this._duty = nextDuty;
};
SCUnitRepository.registerSCUnitClass("Pulse", SCUnitPulse);
module.exports = SCUnitPulse;
