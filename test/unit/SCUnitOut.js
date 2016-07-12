"use strict";

const test = require("eater/runner").test;
const assert = require("assert");
const scsynth = require("../../src");

const context = new scsynth.SCContext({ blockSize: 8 });

test("a", () => {
  const synthdef = {
    name: "OutTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC" , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC" , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "Out", 2, 0, [ [ -1, 0 ], [ 0, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);
  const noise0 = Float32Array.from({ length: 8 }, () => Math.random());
  const noise1 = Float32Array.from({ length: 8 }, () => Math.random());

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  assert.deepEqual(context.audioBuses[0], noise0);
  assert.deepEqual(context.audioBuses[1], noise1);
  assert.deepEqual(context.outputs[0], noise0);
  assert.deepEqual(context.outputs[1], noise1);

  synth.close();
});

test("k", () => {
  const synthdef = {
    name: "OutTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC" , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC" , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "Out", 1, 0, [ [ -1, 0 ], [ 0, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);
  const noise0 = Float32Array.from({ length: 8 }, () => Math.random());
  const noise1 = Float32Array.from({ length: 1 }, () => Math.random());

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  assert.deepEqual(context.controlBuses[0], [ noise0[0] ]);
  assert.deepEqual(context.controlBuses[1], [ noise1[0] ]);
  assert.deepEqual(context.outputs[0], [ 0, 0, 0, 0, 0, 0, 0, 0 ]);
  assert.deepEqual(context.outputs[1], [ 0, 0, 0, 0, 0, 0, 0, 0 ]);

  synth.close();
});
