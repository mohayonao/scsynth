"use strict";

class SCRate {
  constructor(sampleRate, bufferLength) {
    this.sampleRate = sampleRate;
    this.sampleDur = 1 / sampleRate;
    this.radiansPerSample = (Math.PI * 2) / sampleRate;
    this.bufferLength = bufferLength;
    this.bufferDuration = bufferLength / sampleRate;
    this.bufferRate = 1 / this.bufferDuration;
    this.slopeFactor = 1 / bufferLength;
    this.filterLoops = (bufferLength / 3)|0;
    this.filterRemain = (bufferLength % 3)|0;
    if (this.filterLoops === 0) {
      this.filterSlope = 0;
    } else {
      this.filterSlope = 1 / this.filterLoops;
    }
  }
}

module.exports = SCRate;
