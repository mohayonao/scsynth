"use strict";

function toPowerOfTwo(value, round) {
  round = round || Math.round;
  return 1 << round(Math.log(value) / Math.log(2));
}

module.exports = toPowerOfTwo;
