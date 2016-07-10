"use strict";

const C = require("../Constants");

function next(unit, index, offset) {
  const fromUnit = unit.inputSpecs[index].unit;

  if (fromUnit) {
    switch (fromUnit.calcRate) {
    case C.RATE_AUDIO:
      return unit.inputs[index][offset - 1];
    case C.RATE_DEMAND:
      fromUnit.process(offset);
      break;
    }
  }

  return unit.inputs[index][0];
}

function reset(unit, index) {
  const fromUnit = unit.inputSpecs[index].unit;

  if (fromUnit && fromUnit.calcRate === C.RATE_DEMAND) {
    fromUnit.process(0);
  }
}

module.exports = { next, reset };
