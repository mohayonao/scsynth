"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "WhiteNoiseTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "WhiteNoise", 2, 0, [                     ], [ 2 ] ],
      [ "Out"       , 2, 0, [ [ -1, 0 ], [ 0, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0];
    context.process();

    const expected = x => -1 <= x && x <= 1;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
