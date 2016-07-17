"use strict";

const assert = require("assert");
const test = require("eatest");
const SCRandom = require("sc-random");
const scsynth = require("../../src");

test.fork("d", () => {
  Math.random = new SCRandom(12345).random;

  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DstutterTest",
    consts: [ 0, 6, 1, 2, 3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 2, 0, [ [ -1, 0 ]                                  ], [ 2 ] ],
      [ "DC"      , 1, 0, [ [ -1, 0 ]                                  ], [ 1 ] ],
      [ "Dser"    , 3, 0, [ [ -1, 1 ], [ -1, 2 ], [ -1, 3 ], [ -1, 4 ] ], [ 3 ] ],
      [ "Dstutter", 3, 0, [ [  1, 0 ], [  2, 0 ]                       ], [ 3 ] ],
      [ "Demand"  , 2, 0, [ [  0, 0 ], [ -1, 0 ], [  3, 0 ]            ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [  4, 0 ],                      ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 2 ]);
    context.process();

    const expected = new Float32Array([ 1, 1, 1, 1, 2, 2, 2, 2 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 1 ]);
    context.process();

    const expected = new Float32Array([ 3, 3, 1, 1, 2, 2, 3, 3 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
