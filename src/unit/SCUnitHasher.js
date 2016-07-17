"use strict";

const assert = require("assert");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

const f32 = new Float32Array(1);
const i32 = new Int32Array(f32.buffer);
const dspProcess = {};

class SCUnitHasher extends SCUnit {
  initialize() {
    assert(this.inputs.length === 1);
    this.dspProcess = dspProcess["a"];
    this.dspProcess(1);
  }
}

dspProcess["a"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];

  for (let i = 0; i < inNumSamples; i++) {
    f32[0] = inIn[i];
    i32[0] = 0x40000000 | (hash(i32[0]) >>> 9);
    out[i] = f32[0] - 3;
  }
};

function hash(hash) {
  hash += ~(hash << 15);
  hash ^=   hash >> 10;
  hash +=   hash << 3;
  hash ^=   hash >> 6;
  hash += ~(hash << 11);
  hash ^=   hash >> 16;
  return hash;
}

SCUnitRepository.registerSCUnitClass("Hasher", SCUnitHasher);

module.exports = SCUnitHasher;
