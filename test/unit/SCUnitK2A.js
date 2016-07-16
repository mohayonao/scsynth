"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(1, Math.random));
  const synthdef = {
    name: "K2ATest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC" , 1, 0, [ [ -1, 0 ]           ], [ 1 ] ],
      [ "K2A", 2, 0, [ [  0, 0 ]           ], [ 2 ] ],
      [ "Out", 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in
    context.process();

    const expected = new Float32Array(64).fill(noise0[0]);

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
