"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("akkk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "FreeVerbTest",
    consts: [ 0, 0.33, 0.5, 0.5 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"      , 2, 0, [ [ -1, 0 ]                               ], [ 2 ] ],
      [ "DC"      , 1, 0, [ [ -1, 1 ]                               ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 2 ]                               ], [ 1 ] ],
      [ "DC"      , 1, 0, [ [ -1, 3 ]                               ], [ 1 ] ],
      [ "FreeVerb", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 2 ] ],
      [ "Out"     , 2, 0, [ [ -1, 0 ], [ 4, 0 ]                     ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in

    for (let i = 0; i < 64; i++) {
      context.process();
    }

    const expected = Number.isFinite;

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
