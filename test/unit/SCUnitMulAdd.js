"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("aaa", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = (_, i) => noise0[i] * noise1[i] + noise2[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aak", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = (_, i) => noise0[i] * noise1[i] + (noise2[0] * (i / 8));
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aai", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const noise2 = Math.fround(Math.random());
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise2 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                     ], [ 0 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  context.process();

  const calc = (_, i) => noise0[i] * noise1[i] + noise2;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aka", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = (_, i) => noise0[i] * (noise1[0] * (i / 8)) + noise2[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("akk", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = (_, i) => noise0[i] * (noise1[0] * (i / 8)) + (noise2[0] * (i / 8));
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aki", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = Math.fround(Math.random());
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise2 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                     ], [ 0 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  context.process();

  const calc = (_, i) => noise0[i] * (noise1[0] * (i / 8)) + noise2;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aia", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = Math.fround(Math.random());
  const noise2 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                     ], [ 0 ] ],
      [ "DC"    , 2, 0, [ [ -1, 0 ]                     ], [ 2 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = (_, i) => noise0[i] * noise1 + noise2[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aik", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = Math.fround(Math.random());
  const noise2 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                      ], [ 2 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                      ], [ 0 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                      ], [ 1 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [  1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = (_, i) => noise0[i] * noise1 + (noise2[0] * (i / 8));
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("aii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = Math.fround(Math.random());
  const noise2 = Math.fround(Math.random());
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise1, noise2 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                      ], [ 2 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                      ], [ 0 ] ],
      [ "DC"    , 0, 0, [ [ -1, 2 ]                      ], [ 0 ] ],
      [ "MulAdd", 2, 0, [ [  0, 0 ], [  1, 0 ], [ 2, 0 ] ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  context.process();

  const calc = (_, i) => noise0[i] * noise1 + noise2;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("kkk", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "MulAdd", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 1 ] ],
      [ "Out"   , 1, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = () => noise0[0] * noise1[0] + noise2[0];
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("kki", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const noise2 = Math.fround(Math.random());
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise2 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                     ], [ 0 ] ],
      [ "MulAdd", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 1 ] ],
      [ "Out"   , 1, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);
  context.process();

  const calc = () => noise0[0] * noise1[0] + noise2;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("kik", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = Math.fround(Math.random());
  const noise2 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                     ], [ 0 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "MulAdd", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 1 ] ],
      [ "Out"   , 1, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[2].outputs[0].set(noise2);
  context.process();

  const calc = () => noise0[0] * noise1 + noise2[0];
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("kii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = Math.fround(Math.random());
  const noise2 = Math.fround(Math.random());
  const synthdef = {
    name: "MulAddTest",
    consts: [ 0, noise1, noise2 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 1, 0, [ [ -1, 0 ]                     ], [ 1 ] ],
      [ "DC"    , 0, 0, [ [ -1, 1 ]                     ], [ 0 ] ],
      [ "DC"    , 0, 0, [ [ -1, 2 ]                     ], [ 0 ] ],
      [ "MulAdd", 1, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ] ], [ 1 ] ],
      [ "Out"   , 1, 0, [ [ -1, 0 ], [ 3, 0 ]           ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);

  synth.unitList[0].outputs[0].set(noise0);
  context.process();

  const calc = () => noise0[0] * noise1 + noise2;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});
