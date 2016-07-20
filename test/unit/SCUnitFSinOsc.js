"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("ki", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "FSinOscTest",
    consts: [ 0, 440, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "DC"     , 0, 0, [ [ -1, 2 ]           ], [ 0 ] ],
      [ "FSinOsc", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0][0] = 440;
    context.process();

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
  {
    synth.unitList[0].outputs[0][0] = 880;
    context.process();

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});

test("ii", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "FSinOscTest",
    consts: [ 0, 440, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 0, 0, [ [ -1, 1 ]           ], [ 0 ] ],
      [ "DC"     , 0, 0, [ [ -1, 2 ]           ], [ 0 ] ],
      [ "FSinOsc", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0][0] = 440;
    context.process();

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
