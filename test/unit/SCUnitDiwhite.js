"use strict";

const assert = require("assert");
const test = require("eatest");
const SCRandom = require("sc-random");
const scsynth = require("../../src");

test.fork("d", () => {
  Math.random = new SCRandom(12345).random;

  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DiwhiteTest",
    consts: [ 0, 7 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 2, 0, [ [ -1, 0 ]                      ], [ 2 ] ],
      [ "DC"     , 1, 0, [ [ -1, 0 ]                      ], [ 1 ] ],
      [ "DC"     , 1, 0, [ [ -1, 0 ]                      ], [ 1 ] ],
      [ "Diwhite", 3, 0, [ [ -1, 1 ], [  1, 0 ], [ 2, 0 ] ], [ 3 ] ],
      [ "Demand" , 2, 0, [ [  0, 0 ], [ -1, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [  4, 0 ],          ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 10 ]);
    synth.unitList[2].outputs[0].set([ 20 ]);
    context.process();

    const expected = new Float32Array([ 14, 14, 18, 18, 10, 10, 12, 12 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 30 ]);
    synth.unitList[2].outputs[0].set([ 40 ]);
    context.process();

    const expected = new Float32Array([ 31, 31, 37, 37, 32, 32, 32, 32 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
