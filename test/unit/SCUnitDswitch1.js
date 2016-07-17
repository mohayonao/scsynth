"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("d", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "OutTest",
    consts: [ 0, Infinity, 1, 2, 3, 4, 5, 6 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 2, 0, [ [ -1, 0 ]                                  ], [ 2 ] ],
      [ "DC"      , 1, 0, [ [ -1, 0 ]                                  ], [ 1 ] ],
      [ "Dser"    , 3, 0, [ [ -1, 1 ], [ -1, 2 ], [ -1, 3 ], [ -1, 4 ] ], [ 3 ] ],
      [ "Dser"    , 3, 0, [ [ -1, 1 ], [ -1, 5 ], [ -1, 6 ], [ -1, 7 ] ], [ 3 ] ],
      [ "Dswitch1", 3, 0, [ [  1, 0 ], [  2, 0 ], [  3, 0 ]            ], [ 3 ] ],
      [ "Demand"  , 2, 0, [ [  0, 0 ], [ -1, 0 ], [  4, 0 ]            ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [  5, 0 ],                      ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 0 ]);
    context.process();

    const expected = new Float32Array([ 1, 1, 2, 2, 3, 3, 1, 1 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 1 ]);
    context.process();

    const expected = new Float32Array([ 4, 4, 5, 5, 6, 6, 4, 4 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
