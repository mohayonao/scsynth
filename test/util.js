"use strict";

const assert = require("assert");
const test = require("eater/runner").test;
const util = require("../src/util");

function closeTo(expected, actual, delta) {
  return Math.abs(expected - actual) <= delta;
}

test("clamp", () => {
  const clamp = require("../src/util/clamp");

  assert(util.clamp === clamp);
  assert(clamp(0, 2, 4) === 2);
  assert(clamp(1, 2, 4) === 2);
  assert(clamp(2, 2, 4) === 2);
  assert(clamp(3, 2, 4) === 3);
  assert(clamp(4, 2, 4) === 4);
  assert(clamp(5, 2, 4) === 4);
  assert(clamp(6, 2, 4) === 4);
});

test("fill", () => {
  const fill = require("../src/util/fill");
  const list = new Float32Array(8);
  const actual = fill(list, 1);
  const expected = new Float32Array([ 1, 1, 1, 1, 1, 1, 1, 1 ]);

  assert(util.fill === fill);
  assert.deepEqual(actual, expected);
  assert.deepEqual(list, expected);
});

test("fill/polyfill", () => {
  const fill = require("../src/util/fill");
  const list = new Float32Array(8);
  // kill native function
  Object.defineProperty(list, "fill", { value: null });
  const actual = fill(list, 1);
  const expected = new Float32Array([ 1, 1, 1, 1, 1, 1, 1, 1 ]);

  assert(util.fill === fill);
  assert.deepEqual(actual, expected);
  assert.deepEqual(list, expected);
});

test("fillRange", () => {
  const fillRange = require("../src/util/fillRange");
  const list = new Float32Array(8);
  const actual = fillRange(list, 1, 2, 6);
  const expected = new Float32Array([ 0, 0, 1, 1, 1, 1, 0, 0 ]);

  assert(util.fillRange === fillRange);
  assert.deepEqual(actual, expected);
  assert.deepEqual(list, expected);
});

test("fillRange/polyfill", () => {
  const fillRange = require("../src/util/fillRange");
  const list = new Float32Array(8);
  // kill native function
  Object.defineProperty(list, "fill", { value: null });
  const actual = fillRange(list, 1, 2, 6);
  const expected = new Float32Array([ 0, 0, 1, 1, 1, 1, 0, 0 ]);

  assert(util.fillRange === fillRange);
  assert.deepEqual(actual, expected);
  assert.deepEqual(list, expected);
});

test("sc_cubicinterp", () => {
  const sc_cubicinterp = require("../src/util/sc_cubicinterp");

  assert(util.sc_cubicinterp === sc_cubicinterp);
  assert(closeTo(sc_cubicinterp(0.0, 0.00, 0.33, 0.66, 1.00), 0.330000, 1e-6));
  assert(closeTo(sc_cubicinterp(0.1, 0.00, 0.33, 0.66, 1.00), 0.362955, 1e-6));
  assert(closeTo(sc_cubicinterp(0.2, 0.00, 0.33, 0.66, 1.00), 0.395840, 1e-6));
  assert(closeTo(sc_cubicinterp(0.3, 0.00, 0.33, 0.66, 1.00), 0.428685, 1e-6));
  assert(closeTo(sc_cubicinterp(0.4, 0.00, 0.33, 0.66, 1.00), 0.461520, 1e-6));
  assert(closeTo(sc_cubicinterp(0.5, 0.00, 0.33, 0.66, 1.00), 0.494375, 1e-6));
  assert(closeTo(sc_cubicinterp(0.6, 0.00, 0.33, 0.66, 1.00), 0.527280, 1e-6));
  assert(closeTo(sc_cubicinterp(0.7, 0.00, 0.33, 0.66, 1.00), 0.560265, 1e-6));
  assert(closeTo(sc_cubicinterp(0.8, 0.00, 0.33, 0.66, 1.00), 0.593360, 1e-6));
  assert(closeTo(sc_cubicinterp(0.9, 0.00, 0.33, 0.66, 1.00), 0.626595, 1e-6));
  assert(closeTo(sc_cubicinterp(1.0, 0.00, 0.33, 0.66, 1.00), 0.660000, 1e-6));
});

test("sc_fold", () => {
  const sc_fold = require("../src/util/sc_fold");

  assert(util.sc_fold === sc_fold);
  assert(closeTo(sc_fold(-2.00, -0.2, 0.4), +0.40, 1e-6));
  assert(closeTo(sc_fold(-1.25, -0.2, 0.4), -0.05, 1e-6));
  assert(closeTo(sc_fold(-1.00, -0.2, 0.4), +0.20, 1e-6));
  assert(closeTo(sc_fold(-0.75, -0.2, 0.4), +0.35, 1e-6));
  assert(closeTo(sc_fold(-0.50, -0.2, 0.4), +0.10, 1e-6));
  assert(closeTo(sc_fold(-0.25, -0.2, 0.4), -0.15, 1e-6));
  assert(closeTo(sc_fold(+0.00, -0.2, 0.4), +0.00, 1e-6));
  assert(closeTo(sc_fold(+0.25, -0.2, 0.4), +0.25, 1e-6));
  assert(closeTo(sc_fold(+0.50, -0.2, 0.4), +0.30, 1e-6));
  assert(closeTo(sc_fold(+0.75, -0.2, 0.4), +0.05, 1e-6));
  assert(closeTo(sc_fold(+1.00, -0.2, 0.4), -0.20, 1e-6));
  assert(closeTo(sc_fold(+1.25, -0.2, 0.4), +0.05, 1e-6));
  assert(closeTo(sc_fold(+2.00, -0.2, 0.4), +0.00, 1e-6));
  assert(closeTo(sc_fold(+0.00, +0.0, 0.0), +0.00, 1e-6));
});

test("sc_wrap", () => {
  const sc_wrap = require("../src/util/sc_wrap");

  assert(util.sc_wrap === sc_wrap);
  assert(closeTo(sc_wrap(-2.00, -0.2, 0.4), -0.20, 1e-6));
  assert(closeTo(sc_wrap(-1.25, -0.2, 0.4), -0.05, 1e-6));
  assert(closeTo(sc_wrap(-1.00, -0.2, 0.4), +0.20, 1e-6));
  assert(closeTo(sc_wrap(-0.75, -0.2, 0.4), -0.15, 1e-6));
  assert(closeTo(sc_wrap(-0.50, -0.2, 0.4), +0.10, 1e-6));
  assert(closeTo(sc_wrap(-0.25, -0.2, 0.4), +0.35, 1e-6));
  assert(closeTo(sc_wrap(+0.00, -0.2, 0.4), +0.00, 1e-6));
  assert(closeTo(sc_wrap(+0.25, -0.2, 0.4), +0.25, 1e-6));
  assert(closeTo(sc_wrap(+0.50, -0.2, 0.4), -0.10, 1e-6));
  assert(closeTo(sc_wrap(+0.75, -0.2, 0.4), +0.15, 1e-6));
  assert(closeTo(sc_wrap(+1.00, -0.2, 0.4), +0.40, 1e-6));
  assert(closeTo(sc_wrap(+1.25, -0.2, 0.4), +0.05, 1e-6));
  assert(closeTo(sc_wrap(+2.00, -0.2, 0.4), +0.20, 1e-6));
  assert(closeTo(sc_wrap(+0.00, +0.0, 0.0), +0.00, 1e-6));
});

test("toNumber", () => {
  const toNumber = require("../src/util/toNumber");

  assert(util.toNumber === toNumber);
  assert(toNumber(1) === 1);
  assert(toNumber(Infinity) === Infinity);
  assert(toNumber("1") === 1);
  assert(toNumber(NaN) === 0);
});

test("toPowerOfTwo", () => {
  const toPowerOfTwo = require("../src/util/toPowerOfTwo");

  assert(util.toPowerOfTwo === toPowerOfTwo);
  assert(toPowerOfTwo(1) === 1);
  assert(toPowerOfTwo(2) === 2);
  assert(toPowerOfTwo(3) === 4);
});
