"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("ki", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "LFParTest",
    consts: [ 0, 10, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 2, 0, [ [ -1, 1 ]           ], [ 2 ] ],
      [ "DC"   , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "LFPar", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  for (let n = 0; n < 10; n++) {
    synth.unitList[0].outputs[0].fill(10); // freq
    context.process();

    const expected = x => Math.abs(x) < 1 + 1e-6;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
