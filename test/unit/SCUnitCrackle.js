"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("k", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "CrackleTest",
    consts: [ 0, 2 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "Crackle", 2, 0, [ [  0, 0 ]           ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  for (let n = 0; n < 10; n++) {
    synth.unitList[0].outputs[0];
    context.process();

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
