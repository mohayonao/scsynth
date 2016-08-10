"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("ii", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "RandTest",
    consts: [ 0, 0.5, 1.5 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "Rand", 0, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 0 ] ],
      [ "K2A" , 2, 0, [ [  2, 0 ]           ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 3, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  const expected = (x, i, list) => i === 0 ? (x === list[0]) : (0.5 <= x && x <= 1.5);

  {
    synth.unitList[0].outputs[0];
    context.process();

    // for (let i = 0; i < 1; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
