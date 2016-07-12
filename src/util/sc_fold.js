"use strict";

function fold(val, lo, hi) {
  if (hi === lo) {
    return lo;
  }

  if (val >= hi) {
    val = (hi * 2) - val;
    if (val >= lo) {
      return val;
    }
  } else if (val < lo) {
    val = (lo * 2) - val;
    if (val < hi) {
      return val;
    }
  } else {
    return val;
  }

  const range1 = hi - lo;
  const range2 = range1 * 2;

  let x = (val - lo);

  x -= range2 * Math.floor(x / range2);

  if (x >= range1) {
    return range2 - x + lo;
  }

  return x + lo;
}

module.exports = fold;
