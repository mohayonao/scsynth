"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("aiii", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "AmpCompTest",
    consts: [ 0, 1000, 0, 0.32, 1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 2, 0, [ [ -1, 1 ]                               ], [ 2 ] ],
      [ "DC"      , 1, 0, [ [ -1, 2 ]                               ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 3 ]                               ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 4 ]                               ], [ 1 ] ],
      [ "AmpCompA", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].fill(440); // in
    context.process();

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});

test("aii", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "AmpCompTest",
    consts: [ 0, 440, 300, 0.3333 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 2, 0, [ [ -1, 1 ]                     ], [ 2 ] ],
      [ "DC"     , 0, 0, [ [ -1, 2 ]                     ], [ 0 ] ],
      [ "DC"     , 0, 0, [ [ -1, 3 ]                     ], [ 0 ] ],
      [ "AmpComp", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].fill(440); // in
    context.process();

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
