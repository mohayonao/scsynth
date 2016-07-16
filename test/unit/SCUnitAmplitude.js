"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("akk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "AmplitudeTest",
    consts: [ 0, 0.1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"       , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"       , 1, 0, [ [ -1, 1 ]                     ], [ 1 ] ],
      [ "DC"       , 1, 0, [ [ -1, 1 ]                     ], [ 1 ] ],
      [ "Amplitude", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"      , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in

    context.process();

    const expected = x => !Number.isNaN(x);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
  {
    synth.unitList[1].outputs[0].fill(0.5); // attackTime
    synth.unitList[2].outputs[0].fill(0.5); // releaseTime

    context.process();

    const expected = x => !Number.isNaN(x);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
});

test("akk/atok", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "AmplitudeTest",
    consts: [ 0, 0.1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"       , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"       , 1, 0, [ [ -1, 1 ]                     ], [ 1 ] ],
      [ "DC"       , 1, 0, [ [ -1, 1 ]                     ], [ 1 ] ],
      [ "Amplitude", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 1 ] ],
      [ "Out"      , 1, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.controlBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in

    context.process();

    const expected = x => !Number.isNaN(x);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
  {
    synth.unitList[1].outputs[0].fill(0.5); // attackTime
    synth.unitList[2].outputs[0].fill(0.5); // releaseTime

    context.process();

    const expected = x => !Number.isNaN(x);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
});
