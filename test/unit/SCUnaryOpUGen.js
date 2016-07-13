"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(8, Math.random));
  const synthdef = {
    name: "UnaryOpUGenTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"         , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "UnaryOpUGen", 2, 0, [ [  0, 0 ],          ], [ 2 ] ],
      [ "Out"        , 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);

  context.addToTail(synth);
  context.process();

  const calc = (_, i) => -noise0[i];
  const expected = new Float32Array(nmap(8, calc));
  const actual = context.audioBuses[0];

  assert.deepEqual(actual, expected);
});

test("k", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "UnaryOpUGenTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"         , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "UnaryOpUGen", 1, 0, [ [  0, 0 ],          ], [ 1 ] ],
      [ "Out"        , 1, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  synth.unitList[0].outputs[0].set(noise0);

  context.addToTail(synth);
  context.process();

  const calc = () => -noise0[0];
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});

test("i", () => {
  const context = new scsynth.SCContext({ blockSize: 8 });
  const noise0 = Math.fround(Math.random());
  const synthdef = {
    name: "UnaryOpUGenTest",
    consts: [ 0, noise0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"         , 0, 0, [ [ -1, 1 ]           ], [ 0 ] ],
      [ "UnaryOpUGen", 0, 0, [ [  0, 0 ],          ], [ 0 ] ],
      [ "Out"        , 1, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);
  context.process();

  const calc = () => -noise0;
  const expected = new Float32Array(nmap(1, calc));
  const actual = context.controlBuses[0];

  assert.deepEqual(actual, expected);
});
