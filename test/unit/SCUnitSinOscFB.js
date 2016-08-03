"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("kk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "SinOscTest",
    consts: [ 0, 440, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "SinOscFB", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  for (let n = 0; n < 12; n++) {
    if (n % 2 === 0) {
      synth.unitList[0].outputs[0].fill(440 * Math.pow(2, n / 12)); // freq
    }
    if (n % 2 === 1) {
      synth.unitList[1].outputs[0].fill(Math.random());             // feedback
    }
    context.process();

    const expected = x => Math.abs(x) <= 1 + 1e-6;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
