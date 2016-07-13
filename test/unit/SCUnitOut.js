"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
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

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  assert.deepEqual(context.audioBuses[0], noise0);
  assert.deepEqual(context.audioBuses[1], noise1);
  assert.deepEqual(context.outputs[0], noise0);
  assert.deepEqual(context.outputs[1], noise1);
});

test("k", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
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

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  assert.deepEqual(context.controlBuses[0], [ noise0[0] ]);
  assert.deepEqual(context.controlBuses[1], [ noise1[0] ]);
  assert.deepEqual(context.outputs[0], [ 0, 0, 0, 0, 0, 0, 0, 0 ]);
  assert.deepEqual(context.outputs[1], [ 0, 0, 0, 0, 0, 0, 0, 0 ]);
});
