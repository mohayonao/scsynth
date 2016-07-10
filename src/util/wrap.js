"use strict";

function wrap(val, lo, hi) {
  if (hi === lo) {
    return lo;
  }

  const range = (hi - lo);

  if (val >= hi) {
    val -= range;
    if (val < hi) {
      return val;
    }
  } else if (val < lo) {
    val += range;
    if (val >= lo) {
      return val;
    }
  } else {
    return val;
  }

  return val - range * Math.floor((val - lo) / range);
}

module.exports = wrap;
