"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("kka", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise2 = nmap(64, (_, i) => i % 8 === 0 ? 1 : 0);
  const synthdef = {
    name: "CoinGateTest",
    consts: [ 0, 0.5, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "DC"      , 2, 0, [ [ -1, 2 ]           ], [ 2 ] ],
      [ "CoinGate", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  for (let n = 0; n < 10; n++) {
    synth.unitList[1].outputs[0].set(noise2);
    context.process();

    const expected = (x, i) => {
      return (i % 8 === 0) ? (x === 0 || x === 1) : (x === 0);
    };

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});

test("kkk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const synthdef = {
    name: "CoinGateTest",
    consts: [ 0, 10, 20, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "CoinGate", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  for (let n = 0; n < 10; n++) {
    synth.unitList[1].outputs[0][0] = n % 4 === 0 ? 1 : 0;
    context.process();

    const expected = (x, i) => {
      return (i === 0) ? (x === 0 || x === 1) : (x === 0);
    };

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
