"use strict";

function fill(list, value) {
  if (list.fill) {
    return list.fill(value);
  }

  for (let i = 0, imax = list.length; i < imax; i++) {
    list[i] = value;
  }

  return list;
}

module.exports = fill;
