"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../../src");

test("kk:linen", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "EnvGenTest",
    consts: [ 1, 0, 3, -99, 0.01, 0.02 ],
    paramValues: [],
    paramIndices: {},
    units: [
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                                                                          ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                                                                          ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 1 ]                                                                                                                                                                                                                          ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                                                                          ], [ 1 ] ],
      [ "EnvGen", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ -1, 1 ], [ -1, 1 ], [ -1, 2 ], [ -1, 3 ], [ -1, 3 ], [ -1, 0 ], [ -1, 4 ], [ -1, 0 ], [ -1, 1 ], [ -1, 0 ], [ -1, 5 ], [ -1, 0 ], [ -1, 1 ], [ -1, 1 ], [ -1, 4 ], [ -1, 0 ], [ -1, 1 ] ], [ 1 ] ],
      [ "Out"   , 1, 0, [ [ -1, 1 ], [ 4, 0 ]                                                                                                                                                                                                                ], [   ] ]
    ],
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.controlBuses[0];

  {
    for (let i = 0; i < 25; i++) {
      if (i === 5) {
        synth.unitList[0].outputs[0].fill(0);
      }
      context.process();

      const expected = Number.isFinite;

      // console.log(i, actual[0]);

      assert(actual.every(expected));
    }
  }
});

test("kk:asr", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "EnvGenTest",
    consts: [ 1, 0, 2, -99, 0.01, 5, -4 ],
    paramValues: [],
    paramIndices: {},
    units: [
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 1 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "EnvGen", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ -1, 1 ], [ -1, 1 ], [ -1, 2 ], [ -1, 0 ], [ -1, 3 ], [ -1, 0 ], [ -1, 4 ], [ -1, 5 ], [ -1, 6 ], [ -1, 1 ], [ -1, 4 ], [ -1, 5 ], [ -1, 6 ] ], [ 1 ] ],
      [ "Out"   , 1, 0, [ [ -1, 1 ], [ 4, 0 ]                                                                                                                                                                    ], [   ] ]
    ],
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.controlBuses[0];

  {
    for (let i = 0; i < 25; i++) {
      if (i === 15) {
        synth.unitList[0].outputs[0].fill(0);
      }
      context.process();

      const expected = Number.isFinite;

      // console.log(i, actual[0]);

      assert(actual.every(expected));
    }
  }
});


test("ak:asr", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "EnvGenTest",
    consts: [ 1, 0, 2, -99, 0.01, 5, -4 ],
    paramValues: [],
    paramIndices: {},
    units: [
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 1 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "EnvGen", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ -1, 1 ], [ -1, 1 ], [ -1, 2 ], [ -1, 0 ], [ -1, 3 ], [ -1, 0 ], [ -1, 4 ], [ -1, 5 ], [ -1, 6 ], [ -1, 1 ], [ -1, 4 ], [ -1, 5 ], [ -1, 6 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 1 ], [ 4, 0 ]                                                                                                                                                                    ], [   ] ]
    ],
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    for (let i = 0; i < 25; i++) {
      if (i === 15) {
        synth.unitList[0].outputs[0].fill(0);
      }
      context.process();

      const expected = Number.isFinite;

      // console.log(i, actual[0]);

      assert(actual.every(expected));
    }
  }
});

test("aa:asr", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "EnvGenTest",
    consts: [ 1, 0, 2, -99, 0.01, 5, -4 ],
    paramValues: [],
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 2 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 1 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                                                                                                                                                              ], [ 1 ] ],
      [ "EnvGen", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ -1, 1 ], [ -1, 1 ], [ -1, 2 ], [ -1, 0 ], [ -1, 3 ], [ -1, 0 ], [ -1, 4 ], [ -1, 5 ], [ -1, 6 ], [ -1, 1 ], [ -1, 4 ], [ -1, 5 ], [ -1, 6 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 1 ], [ 4, 0 ]                                                                                                                                                                    ], [   ] ]
    ],
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    for (let i = 0; i < 25; i++) {
      if (i === 15) {
        synth.unitList[0].outputs[0].fill(0);
      }
      context.process();

      const expected = Number.isFinite;

      // console.log(i, actual[0]);

      assert(actual.every(expected));
    }
  }
});
