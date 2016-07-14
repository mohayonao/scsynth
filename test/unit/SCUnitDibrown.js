"use strict";

const assert = require("assert");
const test = require("eatest");
const SCRandom = require("sc-random");
const scsynth = require("../../src");

test.fork("d", () => {
  Math.random = new SCRandom(12345).random;

  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DibrownTest",
    consts: [ 0, 7 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 2, 0, [ [ -1, 0 ]                                ], [ 2 ] ],
      [ "DC"     , 1, 0, [ [ -1, 0 ]                                ], [ 1 ] ],
      [ "DC"     , 1, 0, [ [ -1, 0 ]                                ], [ 1 ] ],
      [ "DC"     , 1, 0, [ [ -1, 0 ]                                ], [ 1 ] ],
      [ "Dibrown", 3, 0, [ [ -1, 1 ], [  1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 3 ] ],
      [ "Demand" , 2, 0, [ [  0, 0 ], [ -1, 0 ], [ 4, 0 ]           ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [  5, 0 ],                    ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 10 ]);
    synth.unitList[2].outputs[0].set([ 20 ]);
    synth.unitList[3].outputs[0].set([ 5 ]);
    context.process();

    const expected = new Float32Array([ 13, 13, 15, 15, 10, 10, 12, 12 ]);
    const actual = context.audioBuses[0];

    assert.deepEqual(actual, expected);
  }

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 30 ]);
    synth.unitList[2].outputs[0].set([ 40 ]);
    synth.unitList[3].outputs[0].set([ 2 ]);
    context.process();

    const expected = new Float32Array([ 11, 11, 31, 31, 30, 30, 30, 30 ]);
    const actual = context.audioBuses[0];

    assert.deepEqual(actual, expected);
  }
});
