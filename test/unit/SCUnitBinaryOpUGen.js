"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("aa", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "DC"          , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "BinaryOpUGen", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("ak", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "DC"          , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "BinaryOpUGen", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + (noise1[0] * (i / 8));
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("ai", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const noise1 = Math.fround(Math.random());
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0, noise1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "DC"          , 0, 0, [ [ -1, 1 ]           ], [ 0 ] ],
      [ "BinaryOpUGen", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1;
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("ka", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "DC"          , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "BinaryOpUGen", 2, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 2 ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => (noise0[0] * (i / 8)) + noise1[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("kk", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "DC"          , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "BinaryOpUGen", 1, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 1 ] ],
      [ "Out"         , 1, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);
  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0[0] + noise1[0];
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("ki", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const noise1 = Math.fround(Math.random());
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0, noise1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "DC"          , 0, 0, [ [ -1, 1 ]           ], [ 0 ] ],
      [ "BinaryOpUGen", 1, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 1 ] ],
      [ "Out"         , 1, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0[i] + noise1;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("ia", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = Math.fround(Math.random());
  const noise1 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0, noise0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "BinaryOpUGen", 2, 0, [ [ -1, 1 ], [ 0, 0 ] ], [ 2 ] ],
      [ "Out"         , 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => noise0 + noise1[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("ik", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = Math.fround(Math.random());
  const noise1 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0, noise0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 0, 0, [ [ -1, 1 ]           ], [ 0 ] ],
      [ "DC"          , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "BinaryOpUGen", 1, 0, [ [  0, 0 ], [ 1, 0 ] ], [ 1 ] ],
      [ "Out"         , 1, 0, [ [ -1, 0 ], [ 2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[1].outputs[0].set(noise1);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0 + noise1[0];
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("ii", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = Math.fround(Math.random());
  const noise1 = Math.fround(Math.random());
  const synthdef = {
    name: "BinaryOpUGenTest",
    consts: [ 0, noise0, noise1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"          , 0, 0, [ [ -1, 1 ]            ], [ 0 ] ],
      [ "DC"          , 0, 0, [ [ -1, 2 ]            ], [ 0 ] ],
      [ "BinaryOpUGen", 0, 0, [ [  0, 0 ], [  1, 0 ] ], [ 0 ] ],
      [ "Out"         , 1, 0, [ [ -1, 0 ], [  2, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);
  context.process();

  const calc = () => noise0 + noise1;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});
