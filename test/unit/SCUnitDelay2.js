"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("akk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "Delay2Test",
    consts: [ 0, 0 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 1 ]           ], [ 2 ] ],
      [ "Delay2", 2, 0, [ [  0, 0 ]           ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [ 1, 0 ] ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in
    context.process();

    const expected = (x, i) => i < 2 ? true : x === noise0[i - 2];

    // for (let i = 0; i < 64; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
