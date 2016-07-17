"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("ak", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "LastValueTest",
    consts: [ 0, noise0[0], 0.001 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"       , 2, 0, [ [ -1, 1 ]           ], [ 2 ] ],
      [ "DC"       , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "LastValue", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"      , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in
    context.process();

    const expected = x => noise0.includes(x);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});

test("kk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "LastValueTest",
    consts: [ 0, noise0[0], 0.001 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"       , 1, 0, [ [ -1, 1 ]           ], [ 1 ] ],
      [ "DC"       , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "LastValue", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"      , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in
    context.process();

    const expected = x => noise0.includes(x);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
