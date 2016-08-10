"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("ii", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "IRandTest",
    consts: [ 0, 10, 20 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "DC"   , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "IRand", 0, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 0 ] ],
      [ "K2A"  , 2, 0, [ [  2, 0 ]           ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [ 3, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  const expected = (x, i, list) => i === 0 ? (x === list[0]) : (10 <= x && x < 20) && x % 1 === 0;

  {
    synth.unitList[0].outputs[0];
    context.process();

    // for (let i = 0; i < 1; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
