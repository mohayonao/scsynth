"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("aaaa", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = new Float32Array(nmap(8, Math.random));
  const noise3 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  synth.unitList[3].outputs[0].set(noise3);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1[i] + noise2[i] + noise3[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aaak", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = new Float32Array(nmap(8, Math.random));
  const noise3 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  synth.unitList[3].outputs[0].set(noise3);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1[i] + noise2[i] + (noise3[0] * (i / 8));
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aaai", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = new Float32Array(nmap(8, Math.random));
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1[i] + noise2[i] + noise3;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aakk", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const noise3 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  synth.unitList[3].outputs[0].set(noise3);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1[i] + ((noise2[0] + noise3[0]) * (i / 8));
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aaki", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1[i] + (noise2[0] * (i / 8)) + noise3;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aaii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = Math.fround(Math.random());
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise2, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 2 ]                               ], [ 0 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1[i] + noise2 + noise3;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("akkk", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const noise3 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  synth.unitList[3].outputs[0].set(noise3);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + ((noise1[0] + noise2[0] + noise3[0]) * (i / 8));
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("akki", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + ((noise1[0] + noise2[0]) * (i / 8)) + noise3;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("akii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = Math.fround(Math.random());
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise2, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 2 ]                               ], [ 0 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + (noise1[0] * (i / 8)) + noise2 + noise3;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aiii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = Math.fround(Math.random());
  const noise2 = Math.fround(Math.random());
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise1, noise2, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 2, 0, [ [ -1, 0 ]                                ], [ 2 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                                ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 2 ]                                ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 3 ]                                ], [ 0 ] ],
      [ "Sum4", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out" , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                      ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1 + noise2 + noise3;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("kkkk", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const noise3 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "Sum4", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 1 ] ],
      [ "Out" , 1, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  synth.unitList[3].outputs[0].set(noise3);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0[0] + noise1[0] + noise2[0] + noise3[0];
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("kkki", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "Sum4", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 1 ] ],
      [ "Out" , 1, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0[0] + noise1[0] + noise2[0] + noise3;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("kkii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = Math.fround(Math.random());
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise2, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 2 ]                               ], [ 0 ] ],
      [ "Sum4", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 1 ] ],
      [ "Out" , 1, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0[0] + noise1[0] + noise2 + noise3;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("kiii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = Math.fround(Math.random());
  const noise2 = Math.fround(Math.random());
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise1, noise2, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 1, 0, [ [ -1, 0 ]                               ], [ 1 ] ],
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 2 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 3 ]                               ], [ 0 ] ],
      [ "Sum4", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 1 ] ],
      [ "Out" , 1, 0, [ [ -1, 0 ], [  4, 0 ]                    ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0[0] + noise1 + noise2 + noise3;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("iiii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = Math.fround(Math.random());
  const noise1 = Math.fround(Math.random());
  const noise2 = Math.fround(Math.random());
  const noise3 = Math.fround(Math.random());
  const synthdef = {
    name: "Sum4Test",
    consts: [ 0, noise0, noise1, noise2, noise3 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"  , 0, 0, [ [ -1, 1 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 2 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 3 ]                               ], [ 0 ] ],
      [ "DC"  , 0, 0, [ [ -1, 4 ]                               ], [ 0 ] ],
      [ "Sum4", 0, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 0 ] ],
      [ "Out" , 1, 0, [ [ -1, 0 ], [  4, 0 ]                    ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0 + noise1 + noise2 + noise3;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});
