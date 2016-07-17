"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("aaak", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const noise1 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "Balance2Test",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 2, 0, [ [ -1, 0 ]                               ], [ 2    ] ],
      [ "DC"      , 2, 0, [ [ -1, 0 ]                               ], [ 2    ] ],
      [ "DC"      , 2, 0, [ [ -1, 0 ],                              ], [ 2    ] ],
      [ "DC"      , 1, 0, [ [ -1, 0 ],                              ], [ 1    ] ],
      [ "Balance2", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2, 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 4, 0 ], [ 4, 1 ]           ], [      ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actualL = context.audioBuses[0];
  const actualR = context.audioBuses[1];

  {
    synth.unitList[0].outputs[0].set(noise0); // left
    synth.unitList[1].outputs[0].set(noise1); // right
    synth.unitList[2].outputs[0].fill(-1); // pos
    synth.unitList[3].outputs[0].fill(1);  // level
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

    const expectedL = noise0;
    const expectedR = new Float32Array(64);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
  {
    synth.unitList[2].outputs[0].fill(+1); // pos
    synth.unitList[3].outputs[0].fill(1);  // level
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

    const expectedL = new Float32Array(64);
    const expectedR = noise1;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
  {
    synth.unitList[2].outputs[0].fill(0);    // pos
    synth.unitList[3].outputs[0].fill(0.25); // level
    context.process();

    const expectedL = Number.isFinite;
    const expectedR = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert(actualL.every(expectedL));
    assert(actualR.every(expectedR));
  }
});

test("aakk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const noise1 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "Balance2Test",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 2, 0, [ [ -1, 0 ]                               ], [ 2    ] ],
      [ "DC"      , 2, 0, [ [ -1, 0 ]                               ], [ 2    ] ],
      [ "DC"      , 1, 0, [ [ -1, 0 ],                              ], [ 1    ] ],
      [ "DC"      , 1, 0, [ [ -1, 0 ],                              ], [ 1    ] ],
      [ "Balance2", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2, 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 4, 0 ], [ 4, 1 ]           ], [      ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actualL = context.audioBuses[0];
  const actualR = context.audioBuses[1];

  {
    synth.unitList[0].outputs[0].set(noise0); // left
    synth.unitList[1].outputs[0].set(noise1); // right
    synth.unitList[2].outputs[0].fill(-1); // pos
    synth.unitList[3].outputs[0].fill(1);  // level
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

    const expectedL = noise0;
    const expectedR = new Float32Array(64);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
  {
    synth.unitList[2].outputs[0].fill(+1); // pos
    synth.unitList[3].outputs[0].fill(1);  // level
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

    const expectedL = new Float32Array(64);
    const expectedR = noise1;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert.deepEqual(actualL, expectedL);
    assert.deepEqual(actualR, expectedR);
  }
  {
    synth.unitList[2].outputs[0].fill(0);    // pos
    synth.unitList[3].outputs[0].fill(0.25); // level
    context.process();

    const expectedL = Number.isFinite;
    const expectedR = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actualL[i], actualR[i]);
    // }

    assert(actualL.every(expectedL));
    assert(actualR.every(expectedR));
  }
});
