"use strict";

function clamp(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(value, maxValue));
}

module.exports = clamp;
