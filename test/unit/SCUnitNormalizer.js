"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("aki", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "NormalizerTest",
    consts: [ 0, 0.001 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"        , 2, 0, [ [ -1, 0 ]                      ], [ 2 ] ],
      [ "DC"        , 2, 0, [ [ -1, 0 ]                      ], [ 2 ] ],
      [ "Normalizer", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ -1, 1 ] ], [ 2 ] ],
      [ "Out"       , 2, 0, [ [ -1, 0 ], [ 2, 0 ]            ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in
    synth.unitList[1].outputs[0].fill(0.5); // level

    for (let i = 0; i < 5; i++) {
      context.process();
    }

    const expected = x => Math.abs(x) <= 0.51;

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
  {
    synth.unitList[1].outputs[0].fill(0.1); // level

    for (let i = 0; i < 5; i++) {
      context.process();
    }

    const expected = x => Math.abs(x) <= 0.11;

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
});
