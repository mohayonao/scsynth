"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("ia", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "MedianTest",
    consts: [ 0, noise0[0], 5 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 1 ]           ], [ 2 ] ],
      [ "Median", 2, 0, [ [ -1, 2 ], [ 0, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in

    context.process();

    const expected = x => noise0.includes(x);
    const expected16 = noise0.subarray(16 - 4, 16 + 1).sort()[2];
    const expected32 = noise0.subarray(32 - 4, 32 + 1).sort()[2];
    const expected48 = noise0.subarray(48 - 4, 48 + 1).sort()[2];

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
    assert(actual[16] === expected16);
    assert(actual[32] === expected32);
    assert(actual[48] === expected48);
  }
});
