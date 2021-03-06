"use strict";

const assert = require("assert");
const test = require("eatest");
const SCRandom = require("sc-random");
const scsynth = require("../../src");

test.fork("d", () => {
  Math.random = new SCRandom(12345).random;

  const context = new scsynth.SCContext({ blockSize: 8 });
  const synthdef = {
    name: "DbrownTest",
    consts: [ 0, 7 ],
    paramValues: {},
    paramIndices: {},
    units: [
      [ "DC"    , 2, 0, [ [ -1, 0 ]                                ], [ 2 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                ], [ 1 ] ],
      [ "DC"    , 1, 0, [ [ -1, 0 ]                                ], [ 1 ] ],
      [ "Dbrown", 3, 0, [ [ -1, 1 ], [  1, 0 ], [ 2, 0 ], [ 3, 0 ] ], [ 3 ] ],
      [ "Demand", 2, 0, [ [  0, 0 ], [ -1, 0 ], [ 4, 0 ]           ], [ 2 ] ],
      [ "Out"   , 2, 0, [ [ -1, 0 ], [  5, 0 ],                    ], [   ] ]
    ]
  };
  const synth = context.createSynth(synthdef).appendTo(context);
  const actual = context.audioBuses[0];

  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 1 ]);
    synth.unitList[2].outputs[0].set([ 2 ]);
    synth.unitList[3].outputs[0].set([ 0.05 ]);
    context.process();

    const expected = (x, i, list) => {
      if (x % 2 === 1) {
        return x === list[i - 1];
      }
      return (1 <= x && x < 2) && (i ? Math.abs(x - list[i - 1]) < 0.05 : 1);
    };

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
  {
    synth.unitList[0].outputs[0].set([ 1, 0, 1, 0, 1, 0, 1, 0 ]);
    synth.unitList[1].outputs[0].set([ 3 ]);
    synth.unitList[2].outputs[0].set([ 4 ]);
    synth.unitList[3].outputs[0].set([ 0.01 ]);
    context.process();

    const expected = (x, i, list) => {
      if (i < 3) { return true; } // FIXME: if-condition
      if (x % 2 === 1 || 4 < i) {
        return x === list[i - 1];
      }
      return (3 <= x && x < 4) && (i ? Math.abs(x - list[i - 1]) < 0.01 : 1);
    };

    // for (let i = 0; i < 8; i++) {
    //   console.log(actual[i]);
    // }

    assert(actual.every(expected));
  }
});
