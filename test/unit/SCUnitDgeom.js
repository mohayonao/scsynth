"use strict";

const assert = require("assert");
const test = require("eatest");
const SCRandom = require("sc-random");
const scsynth = require("../../src");

test.fork("d", () => {
  Math.random = new SCRandom(12345).random;

  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DgeomTest",
    consts: [ 0, 7, 3, 2 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                       ], [ 2 ] ],
      [ "Dgeom" , 3, 0, [ [ -1, 1 ], [ -1, 2 ], [ -1, 3 ] ], [ 3 ] ],
      [ "Demand", 2, 0, [ [  0, 0 ], [ -1, 0 ], [  1, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  2, 0 ],           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 3, 3, 6, 6, 12, 12, 24, 24 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 48, 48, 96, 96, 192, 192, 192, 192 ]);

      // for (let i = 0; i < 8; i++) {
      //   console.log(actual[i]);
      // }

    assert.deepEqual(actual, expected);
  }
});
