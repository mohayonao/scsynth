"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("a", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "A2KTest",
    consts: [ 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC" , 2, 0, [ [ -1, 0 ]           ], [ 2 ] ],
      [ "A2K", 1, 0, [ [  0, 0 ]           ], [ 1 ] ],
      [ "Out", 1, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.controlBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in

    context.process();

    const expected = new Float32Array([ noise0[0] ]);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert.deepEqual(actual, expected);
  }
});
