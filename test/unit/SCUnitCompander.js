"use strict";

const assert = require("assert");
const test = require("eatest");
const nmap = require("nmap");
const scsynth = require("../../src");

test("akk", () => {
  const context = new scsynth.SCContext({ blockSize: 64 });
  const noise0 = new Float32Array(nmap(64, Math.random));
  const noise1 = new Float32Array(nmap(64, Math.random));
  const synthdef = {
    name: "CompanderTest",
    consts: [ 0, 0, 0.5, 1, 1, 0.01, 0.1 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"       , 2, 0, [ [ -1, 0 ]                                                             ], [ 2 ] ],
      [ "DC"       , 2, 0, [ [ -1, 1 ]                                                             ], [ 2 ] ],
      [ "DC"       , 2, 0, [ [ -1, 2 ]                                                             ], [ 2 ] ],
      [ "DC"       , 2, 0, [ [ -1, 3 ]                                                             ], [ 2 ] ],
      [ "DC"       , 2, 0, [ [ -1, 4 ]                                                             ], [ 2 ] ],
      [ "DC"       , 2, 0, [ [ -1, 5 ]                                                             ], [ 2 ] ],
      [ "DC"       , 2, 0, [ [ -1, 6 ]                                                             ], [ 2 ] ],
      [ "Compander", 2, 0, [ [  0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ 4, 0 ], [ 5, 0 ], [ 6, 0 ] ], [ 2 ] ],
      [ "Out"      , 2, 0, [ [ -1, 0 ], [ 7, 0 ]                                                   ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef);

  context.addToTail(synth);

  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set(noise0); // in

    context.process();

    const expected = x => !Number.isNaN(x);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
  {
    synth.unitList[1].outputs[0].set(noise1); // control
    synth.unitList[2].outputs[0].fill(0.25);  // thresh
    synth.unitList[3].outputs[0].fill(0.5);   // slopeBelow
    synth.unitList[4].outputs[0].fill(0.5);   // slopeAbove
    synth.unitList[5].outputs[0].fill(0.02);  // clampTime
    synth.unitList[6].outputs[0].fill(0.2);   // relaxTime

    context.process();

    const expected = x => !Number.isNaN(x);

    // for (let i = 0; i < context.blockSize; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.some(x => x));
    assert(actual.every(expected));
  }
});
