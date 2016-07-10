"use strict";

const assert = require("assert");
const test = require("eater/runner").test;
const scsynth = require("../src");

const synthdef = {
  name: "sine",
  consts: [ 0 ],
  paramValues: [ 0.5, 440 ],
  paramIndices: { amp: { index: 0, length: 1 }, freq: { index: 1, length: 1 } },
  specs: [
    [ "Control"     , 1, 0, [                                ], [ 1, 1 ] ],
    [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ -1, 0 ]           ], [ 2    ] ],
    [ "BinaryOpUGen", 2, 2, [ [  1, 0 ], [  0, 0 ]           ], [ 2    ] ],
    [ "Out"         , 2, 0, [ [ -1, 0 ], [  2, 0 ], [ 2, 0 ] ], [      ] ]
  ]
};

const context = new scsynth.SCContext();
const synth = context.createSynth(synthdef);

test("synth", () => {
  assert(synth instanceof scsynth.SCSynth);
  assert(synth.context === context);
  assert(synth.synthdef === synthdef);

  assert.deepEqual(synth.consts, [ new Float32Array([ 0 ]) ]);
  assert.deepEqual(synth.params, new Float32Array([ 0.5, 440 ]));
  assert.deepEqual(synth.paramIndices, { amp: { index: 0, length: 1 }, freq: { index: 1, length: 1 } });

  assert(synth.buffer.length === 1 * 2 + 64 * 2);
});

test("unit[0]: Control", () => {
  const unit = synth.unitList[0];

  assert(unit.context === context);
  assert(unit.synth === synth);
  assert(unit.name === "Control");
  assert(unit.calcRate === scsynth.Constants.RATE_CONTROL);
  assert(unit.specialIndex === 0);
  assert(unit.inputSpecs.length === 0);
  assert(unit.outputSpecs.length === 2);
  assert(unit.inputs.length === 0);
  assert(unit.outputs.length === 2);
});

test("unit[1]: SinOsc", () => {
  const unit = synth.unitList[1];

  assert(unit.context === context);
  assert(unit.synth === synth);
  assert(unit.name === "SinOsc");
  assert(unit.calcRate === scsynth.Constants.RATE_AUDIO);
  assert(unit.specialIndex === 0);
  assert(unit.inputs.length === 2);
  assert(unit.outputs.length === 1);
  assert(unit.inputSpecs[0].unit === synth.unitList[0]);
  assert(unit.inputSpecs[0].rate === synth.unitList[0].outputSpecs[1].rate);
  assert(unit.inputSpecs[1].rate === scsynth.Constants.RATE_SCALAR);
  assert(unit.inputs[0] === synth.unitList[0].outputs[1]);
  assert(unit.inputs[1] === synth.consts[0]);
});

test("unit[2]: BinaryOpUGen", () => {
  const unit = synth.unitList[2];

  assert(unit.context === context);
  assert(unit.synth === synth);
  assert(unit.name === "BinaryOpUGen");
  assert(unit.calcRate === scsynth.Constants.RATE_AUDIO);
  assert(unit.specialIndex === 2);
  assert(unit.inputs.length === 2);
  assert(unit.outputs.length === 1);
  assert(unit.inputSpecs[0].unit === synth.unitList[1]);
  assert(unit.inputSpecs[1].unit === synth.unitList[0]);
  assert(unit.inputSpecs[0].rate === synth.unitList[1].outputSpecs[0].rate);
  assert(unit.inputSpecs[1].rate === synth.unitList[0].outputSpecs[0].rate);
  assert(unit.inputs[0] === synth.unitList[1].outputs[0]);
  assert(unit.inputs[1] === synth.unitList[0].outputs[0]);
});

test("unit[3]: Out", () => {
  const unit = synth.unitList[3];

  assert(unit.context === context);
  assert(unit.synth === synth);
  assert(unit.name === "Out");
  assert(unit.calcRate === scsynth.Constants.RATE_AUDIO);
  assert(unit.specialIndex === 0);
  assert(unit.inputs.length === 3);
  assert(unit.outputs.length === 0);
  assert(unit.inputSpecs[0].unit === null);
  assert(unit.inputSpecs[1].unit === synth.unitList[2]);
  assert(unit.inputSpecs[2].unit === synth.unitList[2]);
  assert(unit.inputSpecs[0].rate === scsynth.Constants.RATE_SCALAR);
  assert(unit.inputSpecs[1].rate === synth.unitList[2].outputSpecs[0].rate);
  assert(unit.inputSpecs[2].rate === synth.unitList[2].outputSpecs[0].rate);
  assert(unit.inputs[0] === synth.consts[0]);
  assert(unit.inputs[1] === synth.unitList[2].outputs[0]);
  assert(unit.inputs[2] === synth.unitList[2].outputs[0]);
});
