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
    name: "OffsetOutTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"       , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"       , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "OffsetOut", 2, 0, [ [ -1, 0 ], [ 0, 0 ], [ 1, 0 ] ], [   ] ]
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

    const expectedL = new Float32Array(nmap(64, (_, i) => noise0[i] + noise2[i]));
    const expectedR = new Float32Array(nmap(64, (_, i) => noise1[i] + noise3[i]));

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
    name: "OffsetOutTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"       , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"       , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "OffsetOut", 1, 0, [ [ -1, 0 ], [ 0, 0 ], [ 1, 0 ] ], [   ] ]
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

    const expectedL = new Float32Array([ noise0[0] + noise2[0] ]);
    const expectedR = new Float32Array([ noise1[0] + noise3[0] ]);

    // for (let i = 0; i < 1; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
});
