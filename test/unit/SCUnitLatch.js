"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("aa", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "LatchTest",
    consts: [ 0, 0, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 2, 0, [ [ -1, 1 ]           ], [ 2 ] ],
      [ "DC"   , 2, 0, [ [ -1, 2 ]           ], [ 2 ] ],
      [ "Latch", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0);
    context.process();

    const expected = new Float32Array(64);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[1].outputs[0][8] = 1;
    context.process();

    const expected = new Float32Array(nmap(64, (_, i) => i < 8 ? 0 : noise0[8]));

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});

test("ak", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "LatchTest",
    consts: [ 0, 0, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"   , 2, 0, [ [ -1, 1 ]           ], [ 2 ] ],
      [ "DC"   , 1, 0, [ [ -1, 2 ]           ], [ 1 ] ],
      [ "Latch", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"  , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0);
    context.process();

    const expected = new Float32Array(64);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
  {
    synth.unitList[1].outputs[0][0] = 1;
    context.process();

    const expected = new Float32Array(64).fill(noise0[0]);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
