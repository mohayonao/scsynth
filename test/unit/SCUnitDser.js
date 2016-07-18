"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("d", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DserTest",
    consts: [ 0, 1, 2, 3, 6 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                                  ], [ 2 ] ],
      [ "Dser"  , 3, 0, [ [ -1, 4 ], [ -1, 1 ], [ -1, 2 ], [ -1, 3 ] ], [ 3 ] ],
      [ "Demand", 2, 0, [ [  0, 0 ], [ -1, 0 ], [  1, 0 ]            ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  2, 0 ],                      ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 1, 1, 2, 2, 3, 3, 1, 1 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 2, 2, 3, 3, 3, 3, 3, 3 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});

test("child", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DserTest",
    consts: [ 0, Infinity, 1, 2, 3, 4 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                       ], [ 2 ] ],
      [ "Dser"  , 3, 0, [ [ -1, 5 ], [ -1, 2 ], [ -1, 4 ] ], [ 3 ] ],
      [ "Dser"  , 3, 0, [ [ -1, 1 ], [ -1, 3 ], [  1, 0 ] ], [ 3 ] ],
      [ "Demand", 2, 0, [ [  0, 0 ], [ -1, 0 ], [  2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  3, 0 ],           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 2, 2, 1, 1, 3, 3, 1, 1 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    context.process();

    const expected = new Float32Array([ 3, 3, 2, 2, 1, 1, 3, 3 ]);

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
