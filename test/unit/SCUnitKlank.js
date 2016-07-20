"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("a:0", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "KlankTest",
    consts: [ 0, 1, 1617, 1557, 1491, 1422, 1277, 1116, 1188 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 2, 0, [ [ -1, 0 ]                                                                                                                                                                      ], [ 2 ] ],
      [ "Klank", 2, 0, [ [  0, 0 ], [ -1, 1 ], [ -1, 0 ], [ -1, 1 ], [ -1, 2 ], [ -1, 1 ], [ -1, 1 ], [ -1, 3 ], [ -1, 1 ], [ -1, 1 ], [ -1, 4 ], [ -1, 1 ], [ -1, 1 ], [ -1, 5 ], [ -1, 1 ], [ -1, 1 ] ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [  1, 0 ]                                                                                                                                                           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0][0] = 1;
    context.process();

    const expected = x => x !== 0 && Math.abs(x) < 2;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});

test("a:1", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "KlankTest",
    consts: [ 0, 1, 1617, 1557, 1491, 1422, 1277, 1116, 1188 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 2, 0, [ [ -1, 0 ]                                                                                                                                                                                                       ], [ 2 ] ],
      [ "Klank", 2, 0, [ [  0, 0 ], [ -1, 1 ], [ -1, 0 ], [ -1, 1 ], [ -1, 2 ], [ -1, 1 ], [ -1, 1 ], [ -1, 3 ], [ -1, 1 ], [ -1, 1 ], [ -1, 4 ], [ -1, 1 ], [ -1, 1 ], [ -1, 5 ], [ -1, 1 ], [ -1, 1 ], [ -1, 6 ], [ -1, 1 ], [ -1, 1 ] ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [  1, 0 ],                                                                                                                                                                                           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0][0] = 1;
    context.process();

    const expected = x => x !== 0 && Math.abs(x) < 2;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});

test("a:2", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "KlankTest",
    consts: [ 0, 1, 1617, 1557, 1491, 1422, 1277, 1116, 1188 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 2, 0, [ [ -1, 0 ]                                                                                                                                                                                                                                        ], [ 2 ] ],
      [ "Klank", 2, 0, [ [  0, 0 ], [ -1, 1 ], [ -1, 0 ], [ -1, 1 ], [ -1, 2 ], [ -1, 1 ], [ -1, 1 ], [ -1, 3 ], [ -1, 1 ], [ -1, 1 ], [ -1, 4 ], [ -1, 1 ], [ -1, 1 ], [ -1, 5 ], [ -1, 1 ], [ -1, 1 ], [ -1, 6 ], [ -1, 1 ], [ -1, 1 ], [ -1, 7 ], [ -1, 1 ], [ -1, 1 ] ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [  1, 0 ]                                                                                                                                                                                                                             ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0][0] = 1;
    context.process();

    const expected = x => x !== 0 && Math.abs(x) < 2;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});

test("a:3", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "KlankTest",
    consts: [ 0, 1, 1617, 1557, 1491, 1422, 1277, 1116, 1188 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 2, 0, [ [ -1, 0 ]                                                                                                                                                                                                                                                                         ], [ 2 ] ],
      [ "Klank", 2, 0, [ [  0, 0 ], [ -1, 1 ], [ -1, 0 ], [ -1, 1 ], [ -1, 2 ], [ -1, 1 ], [ -1, 1 ], [ -1, 3 ], [ -1, 1 ], [ -1, 1 ], [ -1, 4 ], [ -1, 1 ], [ -1, 1 ], [ -1, 5 ], [ -1, 1 ], [ -1, 1 ], [ -1, 6 ], [ -1, 1 ], [ -1, 1 ], [ -1, 7 ], [ -1, 1 ], [ -1, 1 ], [ -1, 8 ], [ -1, 1 ], [ -1, 1 ] ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [  1, 0 ]                                                                                                                                                                                                                                                              ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0][0] = 1;
    context.process();

    const expected = x => x !== 0 && Math.abs(x) < 2;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
