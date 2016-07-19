"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const noise1 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "InTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "WhiteNoise", 2, 0, [                               ], [ 2    ] ],
      [ "DC"        , 1, 0, [ [ -1, 0 ]                     ], [ 1    ] ],
      [ "In"        , 2, 0, [ [  1, 0 ]                     ], [ 2, 2 ] ],
      [ "Out"       , 2, 0, [ [ -1, 0 ], [ 2, 0 ], [ 2, 1 ] ], [      ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actualL = context.audioBuses[0];
  const actualR = context.audioBuses[1];

  synth.unitList[0].dspProcess = () => {
    context.audioBuses[2].set(noise0);
    context.audioBuses[3].set(noise1);
  };

  {
    synth.unitList[1].outputs[0][0] = 2;
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
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "InTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "WhiteNoise", 2, 0, [                               ], [ 2    ] ],
      [ "DC"        , 1, 0, [ [ -1, 0 ]                     ], [ 1    ] ],
      [ "In"        , 1, 0, [ [  1, 0 ]                     ], [ 1, 1 ] ],
      [ "Out"       , 1, 0, [ [ -1, 0 ], [ 2, 0 ], [ 2, 1 ] ], [      ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actualL = context.controlBuses[0];
  const actualR = context.controlBuses[1];

  synth.unitList[0].dspProcess = () => {
    context.controlBuses[2].set(noise0);
    context.controlBuses[3].set(noise1);
  };

  {
    synth.unitList[1].outputs[0][0] = 2;
    context.process();

    const expectedL = noise0;
    const expectedR = noise1;

    // for (let i = 0; i < 1; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
});
