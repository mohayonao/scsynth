"use strict";

const toNumber = require("./toNumber");
const clamp = require("./clamp");

const MIN_SAMPLERATE = 3000;
const MAX_SAMPLERATE = 192000;

function toValidSampleRate(value) {
  return clamp(toNumber(value)|0, MIN_SAMPLERATE, MAX_SAMPLERATE);
}

module.exports = toValidSampleRate;
