"use strict";

function sc_randrange(a, b) {
  if (a < b) {
    return Math.random() * (b - a) + a;
  }
  return Math.random() * (a - b) + b;
}

module.exports = sc_randrange;
