"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const dspProcess = {};
const kEnvGen_gate = 0;
const kEnvGen_levelScale = 1;
const kEnvGen_levelBias = 2;
const kEnvGen_timeScale = 3;
const kEnvGen_doneAction = 4;
const kEnvGen_initLevel = 5;
const kEnvGen_numStages = 6;
const kEnvGen_releaseNode = 7;
const kEnvGen_loopNode = 8;
const kEnvGen_nodeOffset = 9;
const shape_Step = 0;
const shape_Linear = 1;
const shape_Exponential = 2;
const shape_Sine = 3;
const shape_Welch = 4;
const shape_Curve = 5;
const shape_Squared = 6;
const shape_Cubed = 7;
const shape_Sustain = 9999;
class SCUnitEnvGen extends SCUnit {
  initialize(rate) {
    this.rate = rate;
    if (this.calcRate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["next_ak"];
    } else {
      this.dspProcess = dspProcess["next_k"];
    }
    this._level = this.inputs[kEnvGen_initLevel][0] * this.inputs[kEnvGen_levelScale][0] + this.inputs[kEnvGen_levelBias][0];
    this._endLevel = this._level;
    this._counter = 0;
    this._stage = 1000000000;
    this._prevGate = 0;
    this._released = false;
    this._releaseNode = this.inputs[kEnvGen_releaseNode][0] | 0;
    this._a1 = 0;
    this._a2 = 0;
    this._b1 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._grow = 0;
    this._shape = 0;
    this.dspProcess(1);
  }
}
dspProcess["next_ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const gate = this.inputs[kEnvGen_gate][0];
  let counter = this._counter;
  let level = this._level;
  let prevGate = this._prevGate;
  let numstages, doneAction, loopNode;
  let envPtr, stageOffset, endLevel, dur, shape, curve;
  let w, a1, a2, b1, y0, y1, y2, grow;
  let i, j = 0;
  let counterOffset = 0;
  if (prevGate <= 0 && gate > 0) {
    this._stage = -1;
    this._released = false;
    this.done = false;
    counter = counterOffset;
  } else if (gate <= -1 && prevGate > -1 && !this._released) {
    numstages = this.inputs[kEnvGen_numStages][0] | 0;
    dur = -gate - 1;
    counter = Math.max(1, dur * this.rate.sampleRate | 0) + counterOffset;
    this._stage = numstages;
    this._shape = shape_Linear;
    this._endLevel = this.inputs[this.numInputs - 4][0] * this.inputs[kEnvGen_levelScale][0] + this.inputs[kEnvGen_levelBias][0];
    this._grow = (this._endLevel - level) / counter;
    this._released = true;
  } else if (prevGate > 0 && gate <= 0 && this._releaseNode >= 0 && !this._released) {
    counter = counterOffset;
    this._stage = this._releaseNode - 1;
    this._released = true;
  }
  this._prevGate = gate;
  let remain = inNumSamples;
  while (remain) {
    let initSegment = false;
    if (counter === 0) {
      numstages = this.inputs[kEnvGen_numStages][0] | 0;
      if (this._stage + 1 >= numstages) {
        counter = Infinity;
        this._shape = 0;
        level = this._endLevel;
        this.done = true;
        doneAction = this.inputs[kEnvGen_doneAction][0] | 0;
        this.doneAction(doneAction);
      } else if (this._stage + 1 === this._releaseNode && !this._released) {
        loopNode = this.inputs[kEnvGen_loopNode][0] | 0;
        if (loopNode >= 0 && loopNode < numstages) {
          this._stage = loopNode;
          initSegment = true;
        } else {
          counter = Infinity;
          this._shape = shape_Sustain;
          level = this._endLevel;
        }
      } else {
        this._stage += 1;
        initSegment = true;
      }
    }
    if (initSegment) {
      stageOffset = (this._stage << 2) + kEnvGen_nodeOffset;
      if (stageOffset + 4 > this.numInputs) {
        return;
      }
      envPtr = this.inputs;
      endLevel = envPtr[0 + stageOffset][0] * this.inputs[kEnvGen_levelScale][0] + this.inputs[kEnvGen_levelBias][0];
      dur = envPtr[1 + stageOffset][0] * this.inputs[kEnvGen_timeScale][0];
      shape = envPtr[2 + stageOffset][0] | 0;
      curve = envPtr[3 + stageOffset][0];
      this._endLevel = endLevel;
      this._shape = shape;
      counter = Math.max(1, dur * this.rate.sampleRate | 0);
      if (counter === 1) {
        this._shape = shape_Linear;
      }
      switch (this._shape) {
      case shape_Step:
        level = endLevel;
        break;
      case shape_Linear:
        this._grow = (endLevel - level) / counter;
        break;
      case shape_Exponential:
        if (Math.abs(level) < 0.000001) {
          level = 0.000001;
        }
        this._grow = Math.pow(endLevel / level, 1 / counter);
        break;
      case shape_Sine:
        w = Math.PI / counter;
        this._a2 = (endLevel + level) * 0.5;
        this._b1 = 2 * Math.cos(w);
        this._y1 = (endLevel - level) * 0.5;
        this._y2 = this._y1 * Math.sin(Math.PI * 0.5 - w);
        level = this._a2 - this._y1;
        break;
      case shape_Welch:
        w = Math.PI * 0.5 / counter;
        this._b1 = 2 * Math.cos(w);
        if (endLevel >= level) {
          this._a2 = level;
          this._y1 = 0;
          this._y2 = -Math.sin(w) * (endLevel - level);
        } else {
          this._a2 = endLevel;
          this._y1 = level - endLevel;
          this._y2 = Math.cos(w) * (level - endLevel);
        }
        level = this._a2 + this._y1;
        break;
      case shape_Curve:
        if (Math.abs(curve) < 0.001) {
          this._shape = shape_Linear;
          this._grow = (endLevel - level) / counter;
        } else {
          a1 = (endLevel - level) / (1 - Math.exp(curve));
          this._a2 = level + a1;
          this._b1 = a1;
          this._grow = Math.exp(curve / counter);
        }
        break;
      case shape_Squared:
        this._y1 = Math.sqrt(level);
        this._y2 = Math.sqrt(endLevel);
        this._grow = (this._y2 - this._y1) / counter;
        break;
      case shape_Cubed:
        this._y1 = Math.pow(level, 0.33333333);
        this._y2 = Math.pow(endLevel, 0.33333333);
        this._grow = (this._y2 - this._y1) / counter;
        break;
      }
    }
    const nsmps = Math.min(remain, counter);
    grow = this._grow;
    a2 = this._a2;
    b1 = this._b1;
    y1 = this._y1;
    y2 = this._y2;
    switch (this._shape) {
    case shape_Step:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
      }
      break;
    case shape_Linear:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
        level += grow;
      }
      break;
    case shape_Exponential:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
        level *= grow;
      }
      break;
    case shape_Sine:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
        y0 = b1 * y1 - y2;
        level = a2 - y0;
        y2 = y1;
        y1 = y0;
      }
      break;
    case shape_Welch:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
        y0 = b1 * y1 - y2;
        level = a2 + y0;
        y2 = y1;
        y1 = y0;
      }
      break;
    case shape_Curve:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
        b1 *= grow;
        level = a2 - b1;
      }
      break;
    case shape_Squared:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
        y1 += grow;
        level = y1 * y1;
      }
      break;
    case shape_Cubed:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
        y1 += grow;
        level = y1 * y1 * y1;
      }
      break;
    case shape_Sustain:
      for (i = 0; i < nsmps; ++i) {
        out[j++] = level;
      }
      break;
    }
    remain -= nsmps;
    counter -= nsmps;
  }
  this._level = level;
  this._counter = counter;
  this._a2 = a2;
  this._b1 = b1;
  this._y1 = y1;
  this._y2 = y2;
};
dspProcess["next_k"] = function () {
  const out = this.outputs[0];
  const gate = this.inputs[kEnvGen_gate][0];
  let counter = this._counter;
  let level = this._level;
  let prevGate = this._prevGate;
  let numstages, doneAction, loopNode;
  let envPtr, stageOffset, endLevel, dur, shape, curve;
  let w, a1, a2, b1, y0, y1, y2, grow;
  let counterOffset = 0;
  if (prevGate <= 0 && gate > 0) {
    this._stage = -1;
    this._released = false;
    this.done = false;
    counter = counterOffset;
  } else if (gate <= -1 && prevGate > -1 && !this._released) {
    numstages = this.inputs[kEnvGen_numStages][0] | 0;
    dur = -gate - 1;
    counter = Math.max(1, dur * this.rate.sampleRate | 0) + counterOffset;
    this._stage = numstages;
    this._shape = shape_Linear;
    this._endLevel = this.inputs[this.numInputs - 4][0] * this.inputs[kEnvGen_levelScale][0] + this.inputs[kEnvGen_levelBias][0];
    this._grow = (this._endLevel - level) / counter;
    this._released = true;
  } else if (prevGate > 0 && gate <= 0 && this._releaseNode >= 0 && !this._released) {
    counter = counterOffset;
    this._stage = this._releaseNode - 1;
    this._released = true;
  }
  this._prevGate = gate;
  let initSegment = false;
  if (counter <= 0) {
    numstages = this.inputs[kEnvGen_numStages][0] | 0;
    if (this._stage + 1 >= numstages) {
      counter = Infinity;
      this._shape = 0;
      level = this._endLevel;
      this.done = true;
      doneAction = this.inputs[kEnvGen_doneAction][0] | 0;
      this.doneAction(doneAction);
    } else if (this._stage + 1 === this._releaseNode && !this._released) {
      loopNode = this.inputs[kEnvGen_loopNode][0] | 0;
      if (loopNode >= 0 && loopNode < numstages) {
        this._stage = loopNode;
        initSegment = true;
      } else {
        counter = Infinity;
        this._shape = shape_Sustain;
        level = this._endLevel;
      }
    } else {
      this._stage += 1;
      initSegment = true;
    }
  }
  if (initSegment) {
    stageOffset = (this._stage << 2) + kEnvGen_nodeOffset;
    if (stageOffset + 4 > this.numInputs) {
      return;
    }
    envPtr = this.inputs;
    endLevel = envPtr[0 + stageOffset][0] * this.inputs[kEnvGen_levelScale][0] + this.inputs[kEnvGen_levelBias][0];
    dur = envPtr[1 + stageOffset][0] * this.inputs[kEnvGen_timeScale][0];
    shape = envPtr[2 + stageOffset][0] | 0;
    curve = envPtr[3 + stageOffset][0];
    this._endLevel = endLevel;
    this._shape = shape;
    counter = Math.max(1, dur * this.rate.sampleRate | 0);
    if (counter === 1) {
      this._shape = shape_Linear;
    }
    switch (this._shape) {
    case shape_Step:
      level = endLevel;
      break;
    case shape_Linear:
      this._grow = (endLevel - level) / counter;
      break;
    case shape_Exponential:
      if (Math.abs(level) < 0.000001) {
        level = 0.000001;
      }
      this._grow = Math.pow(endLevel / level, 1 / counter);
      break;
    case shape_Sine:
      w = Math.PI / counter;
      this._a2 = (endLevel + level) * 0.5;
      this._b1 = 2 * Math.cos(w);
      this._y1 = (endLevel - level) * 0.5;
      this._y2 = this._y1 * Math.sin(Math.PI * 0.5 - w);
      level = this._a2 - this._y1;
      break;
    case shape_Welch:
      w = Math.PI * 0.5 / counter;
      this._b1 = 2 * Math.cos(w);
      if (endLevel >= level) {
        this._a2 = level;
        this._y1 = 0;
        this._y2 = -Math.sin(w) * (endLevel - level);
      } else {
        this._a2 = endLevel;
        this._y1 = level - endLevel;
        this._y2 = Math.cos(w) * (level - endLevel);
      }
      level = this._a2 + this._y1;
      break;
    case shape_Curve:
      if (Math.abs(curve) < 0.001) {
        this._shape = shape_Linear;
        this._grow = (endLevel - level) / counter;
      } else {
        a1 = (endLevel - level) / (1 - Math.exp(curve));
        this._a2 = level + a1;
        this._b1 = a1;
        this._grow = Math.exp(curve / counter);
      }
      break;
    case shape_Squared:
      this._y1 = Math.sqrt(level);
      this._y2 = Math.sqrt(endLevel);
      this._grow = (this._y2 - this._y1) / counter;
      break;
    case shape_Cubed:
      this._y1 = Math.pow(level, 0.33333333);
      this._y2 = Math.pow(endLevel, 0.33333333);
      this._grow = (this._y2 - this._y1) / counter;
      break;
    }
  }
  grow = this._grow;
  a2 = this._a2;
  b1 = this._b1;
  y1 = this._y1;
  y2 = this._y2;
  switch (this._shape) {
  case shape_Step:
    break;
  case shape_Linear:
    level += grow;
    break;
  case shape_Exponential:
    level *= grow;
    break;
  case shape_Sine:
    y0 = b1 * y1 - y2;
    level = a2 - y0;
    y2 = y1;
    y1 = y0;
    break;
  case shape_Welch:
    y0 = b1 * y1 - y2;
    level = a2 + y0;
    y2 = y1;
    y1 = y0;
    break;
  case shape_Curve:
    b1 *= grow;
    level = a2 - b1;
    break;
  case shape_Squared:
    y1 += grow;
    level = y1 * y1;
    break;
  case shape_Cubed:
    y1 += grow;
    level = y1 * y1 * y1;
    break;
  case shape_Sustain:
    break;
  }
  out[0] = level;
  this._level = level;
  this._counter = counter - 1;
  this._a2 = a2;
  this._b1 = b1;
  this._y1 = y1;
  this._y2 = y2;
};
SCUnitRepository.registerSCUnitClass("EnvGen", SCUnitEnvGen);
module.exports = SCUnitEnvGen;
