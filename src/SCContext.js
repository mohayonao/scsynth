"use strict";

const nmap = require("nmap");
const util = require("./util");
const fill = require("./util/fill");
const DefaultConfig = require("./DefaultConfig");
const SCGraphNode = require("./SCGraphNode");
const SCSynth = require("./SCSynth");
const SCRate = require("./SCRate");

const BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT;

class SCContext {
  constructor(opts) {
    opts = Object.assign({}, DefaultConfig, opts);

    this.sampleRate = util.toValidSampleRate(opts.sampleRate);
    this.blockSize = util.toValidBlockSize(opts.blockSize);
    this.numberOfChannels = util.toValidNumberOfChannels(opts.numberOfChannels);
    this.numberOfAudioBus = util.toValidNumberOfAudioBus(opts.numberOfAudioBus);
    this.numberOfControlBus = util.toValidNumberOfControlBus(opts.numberOfControlBus);

    const audioBusLength = this.numberOfAudioBus * this.blockSize;
    const controlBusLength = this.numberOfControlBus;

    this.bus = new Float32Array(audioBusLength + controlBusLength);
    this.audioBuses = nmap(this.numberOfAudioBus, (_, ch) => {
      return new Float32Array(this.bus.buffer, (ch * this.blockSize) * BYTES_PER_ELEMENT, this.blockSize);
    });
    this.controlBuses = nmap(this.numberOfControlBus, (_, ch) => {
      return new Float32Array(this.bus.buffer, (audioBusLength + ch) * BYTES_PER_ELEMENT, 1);
    });
    this.uiValues = new Float32Array(10);

    this.inputs = [];
    this.outputs = nmap(this.numberOfChannels, (_, ch) => this.audioBuses[ch]);

    this.root = new SCGraphNode(this);
    this.root.parent = this; // state hacking
    this.aRate = new SCRate(this.sampleRate, this.blockSize);
    this.kRate = new SCRate(this.sampleRate / this.blockSize, 1);
  }

  createSynth(synthdef) {
    const synth = new SCSynth(this);

    synth.build(synthdef);

    return synth;
  }

  createGroup() {
    return new SCGraphNode(this);
  }

  append(node) {
    this.root.append(node);
    return this;
  }

  prepend(node) {
    this.root.prepend(node);
    return this;
  }

  process() {
    fill(this.bus, 0);
    this.root.process(this.blockSize);
  }
}

module.exports = SCContext;
