"use strict";

function fillRange(list, value, start, end) {
  if (list.fill) {
    return list.fill(value, start, end);
  }

  for (let i = start; i < end; i++) {
    list[i] = value;
  }

  return list;
}

module.exports = fillRange;
