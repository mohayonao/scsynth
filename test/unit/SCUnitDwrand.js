"use strict";

const assert = require("assert");
const test = require("eatest");
const SCRandom = require("sc-random");
const scsynth = require("../../src");

test.fork("d", () => {
  Math.random = new SCRandom(12345).random;

  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DwrandTest",
    consts: [ 0, 7, 3, 0.4, 0.35, 0.25, 5, 6, 7 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                                                                              ], [ 2 ] ],
      [ "Dwrand", 3, 0, [ [ -1, 1 ], [ -1, 2 ], [ -1, 3 ], [ -1, 4 ], [ -1, 5 ], [ -1, 6 ], [ -1, 7 ], [ -1, 8 ] ], [ 3 ] ],
      [ "Demand", 2, 0, [ [  0, 0 ], [ -1, 0 ], [  1, 0 ]                                                        ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  2, 0 ],                                                                  ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 5, 5, 5, 5, 7, 7, 5, 5 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 5, 5, 5, 5, 6, 6, 6, 6 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
