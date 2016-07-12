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
  }

  setParam(key, value) {
    if (!this.paramIndices.hasOwnProperty(key)) {
      throw new TypeError(`param name is not defined: ${ key }`);
    }
    if (this.paramIndices[key].length === 1) {
      this.params[this.paramIndices[key].index] = value;
    } else {
      this.params.set(value, this.paramIndices[key].index);
    }
  }

  getParam(key) {
    if (!this.paramIndices.hasOwnProperty(key)) {
      throw new TypeError(`param name is not defined: ${ key }`);
    }
    if (this.paramIndices[key].length === 1) {
      return this.params[this.paramIndices[key].index];
    } else {
      return this.params.subarray(this.paramIndices[key].index,this.paramIndices[key].index + this.paramIndices[key].length);
    }
  }

  dspProcess() {
    const dspUnitList = this.dspUnitList;

    for (let i = 0, imax = dspUnitList.length; i < imax; i++) {
      dspUnitList[i].dspProcess(dspUnitList[i].bufferLength);
    }
  }
}

module.exports = SCSynth;
