"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "T2KTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC" , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "T2K", 1, 0, [ [  0, 0 ]           ], [ 1 ] ],
      [ "Out", 1, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.controlBuses[0];

  {
    synth.unitList[0].outputs[0].fill(0);
    context.process();

    const expected = new Float32Array([ 0 ]);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0][16] = 0.5;
    synth.unitList[0].outputs[0][32] = 0.8;
    synth.unitList[0].outputs[0][48] = 0.2;
    context.process();

    const expected = new Float32Array([ 0.8 ]);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
