"use strict";

class SCUnit {
  constructor(synth, spec) {
    this.context = synth.context;
    this.synth = synth;
    this.name = spec[0];
    this.calcRate = spec[1];
    this.specialIndex = spec[2];
    this.inputs = new Array(spec[3].length);
    this.outputs = new Array(spec[4].length);
    this.inputSpecs = spec[3].map(() => ({ rate: 0, unit: null }));
    this.outputSpecs = spec[4].map(() => ({ rate: 0 }));
    this.bufferLength = 0;
    this.dspProcess = null;
    this.done = false;
  }

  initialize() {}

  doneAction(action) {
    this.synth.doneAction(action);
  }
}

module.exports = SCUnit;
