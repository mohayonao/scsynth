"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitModDif extends SCUnit {
  initialize(rate) {
    assert(this.inputs.length === 1);

    if (this.calcRate !== C.RATE_AUDIO) {
      this.dspProcess = dspProcess["aaa"];
    } else {
      if (this.inputSpecs[1].rate === C.RATE_AUDIO) {
        if (this.inputSpecs[2].rate === C.RATE_AUDIO) {
          this.dspProcess = dspProcess["aaa"];
        } else {
          this.dspProcess = dspProcess["aak"];
        }
      } else if (this.inputSpecs[2].rate === C.RATE_AUDIO) {
        this.dspProcess = dspProcess["aka"];
      } else {
        this.dspProcess = dspProcess["akk"];
      }
    }


    this.dspProcess = dspProcess["a"];

    this._slopeFactor = rate.slopeFactor;
    this._dif = this.inputs[1][0];
    this._mod = this.inputs[2][0];
  }
}

dspProcess["aaa"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const difIn = this.inputs[1];
  const modIn = this.inputs[2];

  for (let i = 0; i < inNumSamples; i++) {
    const _in = inIn[i];
    const curmod = modIn[i];
    const diff = Math.abs(_in - difIn[i]) % curmod;
    const modhalf = curmod * 0.5;

    out[i] = modhalf - Math.abs(diff - modhalf);
  }
};

dspProcess["aak"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const difIn = this.inputs[1];
  const mod = this._mod;
  const next_mod = this.inputs[2][0];
  const mod_slope = (next_mod - mod) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    const _in = inIn[i];
    const curmod = mod + mod_slope * i;
    const diff = Math.abs(_in - difIn[i]) % curmod;
    const modhalf = curmod * 0.5;

    out[i] = modhalf - Math.abs(diff - modhalf);
  }

  this._mod = next_mod;
};

dspProcess["aka"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const dif = this._dif;
  const modIn = this.inputs[2];
  const next_dif = this.inputs[1][0];
  const dif_slope = (next_dif - dif) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    const _in = inIn[i];
    const curmod = modIn[i];
    const diff = Math.abs(_in - (dif + dif_slope * i)) % curmod;
    const modhalf = curmod * 0.5;

    out[i] = modhalf - Math.abs(diff - modhalf);
  }

  this._dif = next_dif;
};

dspProcess["akk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const dif = this._dif;
  const mod = this._mod;
  const next_dif = this.inputs[1][0];
  const next_mod = this.inputs[2][0];
  const dif_slope = (next_dif - dif) * this._slopeFactor;
  const mod_slope = (next_mod - mod) * this._slopeFactor;

  for (let i = 0; i < inNumSamples; i++) {
    const _in = inIn[i];
    const curmod = mod + mod_slope * i;
    const diff = Math.abs(_in - (dif + dif_slope * i)) % curmod;
    const modhalf = curmod * 0.5;

    out[i] = modhalf - Math.abs(diff - modhalf);
  }

  this._dif = next_dif;
  this._mod = next_mod;
};

SCUnitRepository.registerSCUnitClass("ModDif", SCUnitModDif);

module.exports = SCUnitModDif;
