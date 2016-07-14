"use strict";

const C = require("../Constants");

function isDemand(unit, index) {
  const fromUnit = unit.inputSpecs[index].unit;

  return fromUnit && fromUnit.calcRate === C.RATE_DEMAND;
}

function next(unit, index, inNumSamples) {
  const fromUnit = unit.inputSpecs[index].unit;

  if (fromUnit) {
    switch (fromUnit.calcRate) {
    case C.RATE_AUDIO:
      return unit.inputs[index][inNumSamples - 1];
    case C.RATE_DEMAND:
      fromUnit.dspProcess(inNumSamples);
      /* fall through */
    }
  }

  return unit.inputs[index][0];
}

function reset(unit, index) {
  const fromUnit = unit.inputSpecs[index].unit;

  if (fromUnit && fromUnit.calcRate === C.RATE_DEMAND) {
    fromUnit.dspProcess(0);
  }
}

module.exports = { isDemand, next, reset };
