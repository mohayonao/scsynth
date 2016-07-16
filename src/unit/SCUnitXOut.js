"use strict";

const assert = require("assert");
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};

class SCUnitXOut extends SCUnit {
  initialize(rate) {
    assert(3 <= this.inputs.length);
    if (this.calcRate === C.RATE_AUDIO) {
      assert(
        this.inputSpecs.slice(2).every(
          (spec) => spec.rate === C.RATE_AUDIO
        )
      );
      this.dspProcess = dspProcess["a"];
      this._buses = this.context.audioBuses;
    } else {
      this.dspProcess = dspProcess["k"];
      this._buses = this.context.controlBuses;
    }
    this._slopeFactor = rate.slopeFactor;
    this._xfade = this.inputs[1][0];
  }
}

dspProcess["a"] = function(inNumSamples) {
  const inputs = this.inputs;
  const buses = this._buses;
  const firstBusChannel = inputs[0][0]|0;
  const xfade = this._xfade;
  const nextXFade = this.inputs[1][0];

  if (xfade !== nextXFade) {
    const xfadeSlope = (nextXFade - xfade) * this._slopeFactor;

    for (let ch = 0, chmax = inputs.length - 2; ch < chmax; ch++) {
      const out = buses[firstBusChannel + ch];
      const inIn = inputs[ch + 2];

      for (let i = 0; i < inNumSamples; i++) {
        out[i] += (xfade + xfadeSlope * i) * (inIn[i] - out[i]);
      }
    }

    this._xfade = nextXFade;
  } else if (xfade === 1) {
    for (let ch = 0, chmax = inputs.length - 2; ch < chmax; ch++) {
      const out = buses[firstBusChannel + ch];
      const inIn = inputs[ch + 2];

      out.set(inIn);
    }
  } else if (xfade !== 0) {
    for (let ch = 0, chmax = inputs.length - 2; ch < chmax; ch++) {
      const out = buses[firstBusChannel + ch];
      const inIn = inputs[ch + 2];

      for (let i = 0; i < inNumSamples; i++) {
        out[i] += xfade * (inIn[i] - out[i]);
      }
    }
  }
};

dspProcess["k"] = function() {
  const inputs = this.inputs;
  const buses = this._buses;
  const firstBusChannel = inputs[0][0]|0;
  const xfade = this.inputs[1][0];

  for (let ch = 0, chmax = inputs.length - 2; ch < chmax; ch++) {
    const out = buses[firstBusChannel + ch];
    const _in = inputs[ch + 2][0];

    out[0] += xfade * (_in - out[0]);
  }
};

SCUnitRepository.registerSCUnitClass("XOut", SCUnitXOut);

module.exports = SCUnitXOut;
