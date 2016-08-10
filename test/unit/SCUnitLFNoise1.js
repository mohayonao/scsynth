"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "LFNoise1Test",
    consts: [ 0, 250 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "LFNoise1", 2, 0, [ [  0, 0 ]           ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  for (let n = 0; n < 10; n++) {
    synth.unitList[1].outputs[0];
    context.process();

    const expected = x => -1 <= x && x < +1;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
