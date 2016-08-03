"use strict";

const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const sine = require("./_sine");
const gSineWavetable = sine.gSineWavetable;
const kSineSize = sine.kSineSize;
const kSineMask = sine.kSineMask;

const dspProcess = {};

class SCUnitSinOsc extends SCUnit {
  initialize(rate) {
    this.dspProcess = dspProcess[$r2k(this.inputSpecs)];

    this._slopeFactor = rate.slopeFactor;
    this._radtoinc = sine.kSineSize / (2 * Math.PI);
    this._cpstoinc = sine.kSineSize * (1 / rate.sampleRate);
    this._freq = this.inputs[0][0];
    this._phase = this.inputs[1][0];
    this._x = 0;

    this.dspProcess(1);
  }
}

function $r2k(inputSpecs) {
  return inputSpecs.map(x => x.rate === C.RATE_AUDIO ? "a" : x.rate === C.RATE_SCALAR ? "i" : "k").join("");
}

dspProcess["aa"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const phaseIn = this.inputs[1];
  const cpstoinc = this._cpstoinc;
  const radtoinc = this._radtoinc;

  let x = this._x;

  for (let i = 0; i < inNumSamples; i++) {
    const ix = x + phaseIn[i] * radtoinc;
    const i0 = (ix & kSineMask) << 1;
    const ia = ix % 1;

    out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

    x += freqIn[i] * cpstoinc;
  }

  if (kSineSize <= x) {
    x -= kSineSize;
  }

  this._x = x;
};

dspProcess["ak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const nextPhase = this.inputs[1][0];
  const phase = this._phase;
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;

  let x = this._x;

  if (phase === nextPhase) {
    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + phase * radtoinc;
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += freqIn[i] * cpstoinc;
    }
  } else {
    const phaseSlope = (nextPhase - phase) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + (phase + phaseSlope * i) * radtoinc;
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += freqIn[i] * cpstoinc;
    }

    this._phase = nextPhase;
  }

  if (kSineSize <= x) {
    x -= kSineSize;
  }

  this._x = x;
};

dspProcess["ai"] = function(inNumSamples) {
  const out = this.outputs[0];
  const freqIn = this.inputs[0];
  const phase = this._phase * this._radtoinc;
  const cpstoinc = this._cpstoinc;

  let x = this._x;

  for (let i = 0; i < inNumSamples; i++) {
    const ix = x + phase;
    const i0 = (ix & kSineMask) << 1;
    const ia = ix % 1;

    out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

    x += freqIn[i] * cpstoinc;
  }

  if (kSineSize <= x) {
    x -= kSineSize;
  }

  this._x = x;
};

dspProcess["ka"] = function(inNumSamples) {
  const out = this.outputs[0];
  const nextFreq = this.inputs[0][0];
  const phaseIn = this.inputs[1];
  const freq = this._freq;
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;

  let x = this._x;

  if (nextFreq === freq) {
    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + radtoinc * phaseIn[i];
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += freq * cpstoinc;
    }
  } else {
    const freqSlope = (nextFreq - freq) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + radtoinc * phaseIn[i];
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += (freq + freqSlope * i) * cpstoinc;
    }

    this._freq = nextFreq;
  }

  if (kSineSize <= x) {
    x -= kSineSize;
  }

  this._x = x;
};

dspProcess["kk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const nextFreq = this.inputs[0][0];
  const nextPhase = this.inputs[1][0];
  const radtoinc = this._radtoinc;
  const cpstoinc = this._cpstoinc;

  let freq = this._freq;
  let phase = this._phase;
  let x = this._x;

  if (nextFreq === freq && nextPhase === phase) {
    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + phase * radtoinc;
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += freq * cpstoinc;
    }
  } else {
    const freqSlope = (nextFreq - freq) * this._slopeFactor;
    const phaseSlope = (nextPhase - phase) * this._slopeFactor;

    for (let i = 0; i < inNumSamples; i++) {
      const ix = x + (phase + phaseSlope * i) * radtoinc;
      const i0 = (ix & kSineMask) << 1;
      const ia = ix % 1;

      out[i] = gSineWavetable[i0] + ia * gSineWavetable[i0 + 1];

      x += (freq + freqSlope * i) * cpstoinc;
    }

    this._freq = nextFreq;
    this._phase = nextPhase;
  }

  if (kSineSize <= x) {
    x -= kSineSize;
  }

  this._x = x;
};

dspProcess["ki"] = dspProcess["kk"];
dspProcess["ia"] = dspProcess["ka"];
dspProcess["ik"] = dspProcess["kk"];
dspProcess["ii"] = dspProcess["kk"];

SCUnitRepository.registerSCUnitClass("SinOsc", SCUnitSinOsc);

module.exports = SCUnitSinOsc;
