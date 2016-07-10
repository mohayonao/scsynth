"use strict";

function cubicinterp(x, y0, y1, y2, y3) {
  const c0 = y1;
  const c1 = 0.5 * (y2 - y0);
  const c2 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3;
  const c3 = 0.5 * (y3 - y0) + 1.5 * (y1 - y2);

  return ((c3 * x + c2) * x + c1) * x + c0;
}

module.exports = cubicinterp;
