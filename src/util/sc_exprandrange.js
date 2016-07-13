"use strict";

function sc_exprandrange(a, b) {
  if (a < b) {
    return a * Math.exp(Math.log(b / a) * Math.random());
  }
  return b * Math.exp(Math.log(a / b) * Math.random());
}

module.exports = sc_exprandrange;
