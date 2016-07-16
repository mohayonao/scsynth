"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "T2ATest",
    consts: [ 0, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC" , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "DC" , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "T2A", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out", 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].fill(0);

    context.process();

    const expected = new Float32Array(context.blockSize);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[0].outputs[0][0] = 0.5;
    synth.unitList[1].outputs[0][0] = 8;
    context.process();

    const expected = new Float32Array(context.blockSize);

    expected[8] = 0.5;

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
