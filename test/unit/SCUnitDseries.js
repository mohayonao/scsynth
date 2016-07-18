"use strict";

const assert = require("assert");
const test = require("eatest");
const SCRandom = require("sc-random");
const scsynth = require("../../src");

test.fork("d", () => {
  Math.random = new SCRandom(12345).random;

  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DseriesTest",
    consts: [ 0, 7, 10, 4 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 2, 0, [ [ -1, 0 ]                       ], [ 2 ] ],
      [ "Dseries", 3, 0, [ [ -1, 1 ], [ -1, 2 ], [ -1, 3 ] ], [ 3 ] ],
      [ "Demand" , 2, 0, [ [  0, 0 ], [ -1, 0 ], [  1, 0 ] ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [  2, 0 ],           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 10, 10, 14, 14, 18, 18, 22, 22 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 26, 26, 30, 30, 34, 34, 34, 34 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
