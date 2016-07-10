"use strict";

const SCGraphNode = require("./SCGraphNode");
const SCSynthBuilder = require("./SCSynthBuilder");

class SCSynth extends SCGraphNode {
  constructor(context) {
    super();

    this.context = context;
    this.synthdef = null;
    this.paramIndices = null;
    this.consts = null;
    this.params = null;
    this.buffer = null;
    this.unitList = null;
  }

  build(synthdef) {
    if (this.synthdef !== null) {
      throw new TypeError("synth has be already built");
    }
    this.synthdef = synthdef;
    this.paramIndices = synthdef.paramIndices;

    SCSynthBuilder.build(this, synthdef);

    Object.keys(this.paramIndices).forEach((name) => {
      Object.defineProperty(this, "$" + name, {
        set(value) {
          this.setParam(name, value);
        },
        get() {
          return this.getParam(name);
        },
        enumerable: true, configurable: true
      });
    });

    return this;
  }

  setParam(key, value) {
    if (this.paramIndices.hasOwnProperty(key)) {
      if (this.paramIndices[key].length === 1) {
        this.params[this.paramIndices[key].index] = value;
      } else {
        this.params.set(value, this.paramIndices[key].index);
      }
    }
    return this;
  }

  getParam(key) {
    if (this.paramIndices.hasOwnProperty(key)) {
      if (this.paramIndices[key].length === 1) {
        return this.params[this.paramIndices[key].index];
      } else {
        return this.params.subarray(this.paramIndices[key].index,this.paramIndices[key].index + this.paramIndices[key].length);
      }
    }
    return 0;
  }

  dspProcess() {
    const unitList = this.unitList;

    this.buffer.fill(0);

    for (let i = 0, imax = unitList.length; i < imax; i++) {
      unitList[i].dspProcess(unitList[i].bufferLength);
    }
  }
}

module.exports = SCSynth;
