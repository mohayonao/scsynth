"use strict";

const assert = require("assert");
const test = require("eatest");
const scsynth = require("../src");

const synthdef = {
  name: "sine",
  consts: [],
  paramValues: [ 0.5, 440, 880 ],
  paramIndices: { amp: { index: 0, length: 1 }, freq: { index: 1, length: 2 } },
  units: []
};

const context = new scsynth.SCContext();
const synth = context.createSynth(synthdef);

test("get param", () => {
  assert(synth.$amp === 0.5);
  assert.deepEqual(synth.$freq, [ 440, 880 ]);
});

test("set param", () => {
  synth.$amp = 0.25;
  synth.$freq = [ 330, 660 ];

  assert(synth.$amp === 0.25);
  assert.deepEqual(synth.$freq, [ 330, 660 ]);
  assert.deepEqual(synth.params, [ 0.25, 330, 660 ]);

  synth.$freq[1] = 440;
  assert.deepEqual(synth.params, [ 0.25, 330, 440 ]);
});
