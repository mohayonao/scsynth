"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "FormletTest",
    consts: [ 0, 440, 0.01, 0.1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"     , 1, 0, [ [ -1, 1 ]                               ], [ 1 ] ],
      [ "DC"     , 1, 0, [ [ -1, 2 ]                               ], [ 1 ] ],
      [ "DC"     , 1, 0, [ [ -1, 3 ]                               ], [ 1 ] ],
      [ "Formlet", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out"    , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in
    for (let i = 0; i < 5; i++) {
      context.process();
    }

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
});

test("1", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "FormletTest",
    consts: [ 0, 440, 0.01, 0.1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"     , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"     , 1, 0, [ [ -1, 1 ]                               ], [ 1 ] ],
      [ "DC"     , 1, 0, [ [ -1, 2 ]                               ], [ 1 ] ],
      [ "DC"     , 1, 0, [ [ -1, 3 ]                               ], [ 1 ] ],
      [ "Formlet", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 1 ] ],
      [ "Out"    , 1, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.controlBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in
    for (let i = 0; i < 5; i++) {
      context.process();
    }

    const expected = Number.isFinite;

    // for (let i = 0; i < 1; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
});
