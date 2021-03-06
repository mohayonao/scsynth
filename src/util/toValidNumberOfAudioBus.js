"use strict";

const toNumber = require("./toNumber");
const clamp = require("./clamp");

const MIN_NUMBER_OF_AUDIO_BUS = 2;
const MAX_NUMBER_OF_AUDIO_BUS = 1024;

function toValidNumberOfAudioBus(value) {
  return clamp(toNumber(value), MIN_NUMBER_OF_AUDIO_BUS, MAX_NUMBER_OF_AUDIO_BUS)|0;
}

module.exports = toValidNumberOfAudioBus;
