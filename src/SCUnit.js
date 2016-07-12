"use strict";

class SCUnit {
  constructor(synth, unitSpec) {
    this.context = synth.context;
    this.synth = synth;
    this.name = unitSpec[0];
    this.calcRate = unitSpec[1];
    this.specialIndex = unitSpec[2];
    this.inputs = new Array(unitSpec[3].length);
    this.outputs = new Array(unitSpec[4].length);
    this.inputSpecs = unitSpec[3].map(() => ({ rate: 0, unit: null }));
    this.outputSpecs = unitSpec[4].map(() => ({ rate: 0 }));
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
