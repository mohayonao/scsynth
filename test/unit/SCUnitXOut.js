"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const noise1 = new Float32Array(nmap(64, Math.random));
  const noise2 = new Float32Array(nmap(64, Math.random));
  const noise3 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "XOutTest",
    consts: [ 0, 0.5 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 1 ]                               ], [ 1 ] ],
      [ "XOut", 2, 0, [ [ -1, 0 ], [ 2, 0 ], [ 0, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth1 = context.createSynth(synthdef);
  const synth2 = context.createSynth(synthdef);

  context.addToTail(synth1);
  context.addToTail(synth2);

  const actualL = context.audioBuses[0];
  const actualR = context.audioBuses[1];

  {
    synth1.unitList[0].outputs[0].set(noise0);
    synth1.unitList[1].outputs[0].set(noise1);
    synth2.unitList[0].outputs[0].set(noise2);
    synth2.unitList[1].outputs[0].set(noise3);
    context.process();

    const expectedL = new Float32Array(nmap(64, (_, i) => noise0[i] * 0.25 + noise2[i] * 0.5));
    const expectedR = new Float32Array(nmap(64, (_, i) => noise1[i] * 0.25 + noise3[i] * 0.5));

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
  {
    synth1.unitList[2].outputs[0].set([ 0 ]);
    context.process();

    const expectedL = Number.isFinite;
    const expectedR = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert(actualL.every(expectedL));
    assert(actualR.every(expectedR));
  }
  {
    context.process();

    const expectedL = new Float32Array(nmap(64, (_, i) => noise2[i] * 0.5));
    const expectedR = new Float32Array(nmap(64, (_, i) => noise3[i] * 0.5));

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
  {
    synth1.unitList[2].outputs[0].set([ 1 ]);
    synth2.unitList[2].outputs[0].set([ 0 ]);
    context.process();
    context.process();

    const expectedL = noise0;
    const expectedR = noise1;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
});

test("k", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(64, Math.random));
  const noise3 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "XOutTest",
    consts: [ 0, 0.5 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 1 ]                               ], [ 1 ] ],
      [ "XOut", 1, 0, [ [ -1, 0 ], [ 2, 0 ], [ 0, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth1 = context.createSynth(synthdef);
  const synth2 = context.createSynth(synthdef);

  context.addToTail(synth1);
  context.addToTail(synth2);

  const actualL = context.controlBuses[0];
  const actualR = context.controlBuses[1];

  {
    synth1.unitList[0].outputs[0].set(noise0);
    synth1.unitList[1].outputs[0].set(noise1);
    synth2.unitList[0].outputs[0].set(noise2);
    synth2.unitList[1].outputs[0].set(noise3);
    context.process();

    const expectedL = new Float32Array([ noise0[0] * 0.25 + noise2[0] * 0.5 ]);
    const expectedR = new Float32Array([ noise1[0] * 0.25 + noise3[0] * 0.5 ]);

    // for (let i = 0; i < 1; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
});
