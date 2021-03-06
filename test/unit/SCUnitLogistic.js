"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("kki", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "LogisticTest",
    consts: [ 0, 3, 350, 0.5 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 1, 0, [ [ -1, 1 ]                     ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 2 ]                     ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 3 ]                     ], [ 1 ] ],
      [ "Logistic", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  for (let n = 0; n < 10; n++) {
    synth.unitList[0].outputs[0];
    context.process();

    const expected = x => 0 <= x && x <= 1;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
