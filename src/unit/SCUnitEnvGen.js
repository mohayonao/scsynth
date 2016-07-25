"use strict";

const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");

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
const shape_Hold = 8;
const shape_Sustain = 9999;
const ENVGEN_NOT_STARTED = 1000000000;

const dspProcess = {};
const checkGateKR = () => true;

class SCUnitEnvGen extends SCUnit {
  initialize(rate) {
    if (this.calcRate === C.RATE_AUDIO) {
      if (this.inputSpecs[0].rate === C.RATE_AUDIO) {
        this.dspProcess = dspProcess["aa"];
      } else {
        this.dspProcess = dspProcess["ak"];
      }
    } else {
      this.dspProcess = dspProcess["kk"];
    }

    this._sampleRate = rate.sampleRate;
    this._level = this.inputs[kEnvGen_initLevel][0] * this.inputs[kEnvGen_levelScale][0] + this.inputs[kEnvGen_levelBias][0];
    this._endLevel = this._level;
    this._counter = 0;
    this._stage = ENVGEN_NOT_STARTED;
    this._shape = shape_Hold;
    this._prevGate = 0;
    this._released = false;
    this._releaseNode = this.inputs[kEnvGen_releaseNode][0]|0;

    this.dspProcess(1);
  }
}

function checkGate(unit, index) {
  const gate = unit.inputs[kEnvGen_gate][index];
  const prevGate = unit._prevGate;

  unit._prevGate = gate;

  if (prevGate <= 0 && 0 < gate) {
    unit._counter = index;
    unit._stage = -1;
    unit._released = false;
    unit.done = false;

    return false;
  }

  if (gate <= -1 && -1 < prevGate && !unit._released) {
    const numstages = unit.inputs[kEnvGen_numStages][0]|0;
    const endLevel = unit.inputs[unit.inputs.length - 4] * unit.inputs[kEnvGen_levelScale][0] + unit.inputs[kEnvGen_levelBias][0];
    const dur = -gate - 1;

    unit._counter = Math.max(1, (dur * unit._sampleRate)|0) + index;
    unit._grow = (endLevel - unit._level) / unit._counter;

    unit._stage = numstages;
    unit._shape = shape_Linear;
    unit._endLevel = endLevel;
    unit._released = true;

    return false;
  }

  if (0 < prevGate && gate <= 0 && 0 <= unit._releaseNode && !unit._released) {
    unit._counter = index;
    unit._stage = unit._releaseNode - 1;
    unit._released = true;

    return false;
  }

  return true;
}

function nextSegment(unit) {
  const numstages = unit.inputs[kEnvGen_numStages][0]|0;

  let initSegment = false;

  if (numstages <= unit._stage + 1) {
    unit._counter = Infinity;
    unit._level = unit._endLevel;
    unit._shape = 0;
    unit.done = true;
    unit.doneAction(unit.inputs[kEnvGen_doneAction][0]|0);
  } else if (unit._stage + 1 === (unit.inputs[kEnvGen_releaseNode][0]|0) && !unit._released) {
    const loopNode = unit.inputs[kEnvGen_loopNode][0]|0;

    if (0 <= loopNode && loopNode < numstages) {
      unit._stage = loopNode;
      initSegment = true;
    } else {
      unit._counter = Infinity;
      unit._level = unit._endLevel;
      unit._shape = shape_Sustain;
    }
  } else {
    unit._stage += 1;
    initSegment = true;
  }

  if (!initSegment) {
    return true;
  }

  const stageOffset = (unit._stage << 2) + kEnvGen_nodeOffset;

  if (unit.inputs.length < stageOffset + 4) {
    // oops.
    return false;
  }

  let counter = 0;
  let level = unit._level;
  let grow = unit._grow;
  let a2 = unit._a2;
  let b1 = unit._b1;
  let y2 = unit._y2;
  let y1 = unit._y1;

  const previousEndLevel = unit._endLevel;
  const envPtr = unit.inputs;
  const endLevel = envPtr[0 + stageOffset][0] * unit.inputs[kEnvGen_levelScale][0] + unit.inputs[kEnvGen_levelBias][0];
  const dur      = envPtr[1 + stageOffset][0] * unit.inputs[kEnvGen_timeScale][0];
  const shape    = envPtr[2 + stageOffset][0]|0;
  const curve    = envPtr[3 + stageOffset][0];

  unit._endLevel = endLevel;
  unit._shape    = shape;

  counter = Math.max(1, (dur * unit._sampleRate)|0);

  if (counter == 1) {
    unit._shape = shape_Linear;
  }

  switch (unit._shape) {
  case shape_Step: {
    level = endLevel;
  } break;
  case shape_Hold: {
    level = previousEndLevel;
  } break;
  case shape_Linear: {
    grow = (endLevel - level) / counter;
  } break;
  case shape_Exponential: {
    grow = Math.pow(endLevel / level, 1 / counter);
  } break;
  case shape_Sine: {
    const w = Math.PI / counter;

    a2 = (endLevel + level) * 0.5;
    b1 = 2 * Math.cos(w);
    y1 = (endLevel - level) * 0.5;
    y2 = y1 * Math.sin(Math.PI * 0.5 - w);

    level = a2 - y1;
  } break;
  case shape_Welch: {
    const w = (Math.PI * 0.5) / counter;

    b1 = 2 * Math.cos(w);

    if (level <= endLevel) {
      a2 = level;
      y1 = 0;
      y2 = -Math.sin(w) * (endLevel - level);
    } else {
      a2 = endLevel;
      y1 = level - endLevel;
      y2 = Math.cos(w) * (level - endLevel);
    }
    level = a2 + y1;
  } break;
  case shape_Curve: {
    if (Math.abs(curve) < 0.001) {
      unit._shape = shape_Linear;
      grow = (endLevel - level) / counter;
    } else {
      const a1 = (endLevel - level) / (1 - Math.exp(curve));

      a2 = level + a1;
      b1 = a1;
      grow = Math.exp(curve / counter);
    }
  } break;
  case shape_Squared: {
    y1 = Math.sqrt(level);
    y2 = Math.sqrt(endLevel);
    grow = (y2 - y1) / counter;
  } break;
  case shape_Cubed: {
    y1 = Math.pow(level, 1 / 3);
    y2 = Math.pow(endLevel, 1 / 3);
    grow = (y2 - y1) / counter;
  } break;
  }

  unit._counter = counter;
  unit._level = level;
  unit._grow = grow;
  unit._a2 = a2;
  unit._b1 = b1;
  unit._y2 = y2;
  unit._y1 = y1;

  return true;
}

function perform(unit, index, nsmps, gateCheck, checkGateOnSustain) {
  const out = unit.outputs[0];

  let level = unit._level;
  let grow = unit._grow;
  let a2 = unit._a2;
  let b1 = unit._b1;
  let y2 = unit._y2;
  let y1 = unit._y1;
  let y0;

  switch (unit._shape) {
  case shape_Step:
  case shape_Hold:
  {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
    }
  } break;
  case shape_Linear: {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
      level += grow;
    }
  } break;
  case shape_Exponential: {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
      level *= grow;
    }
  } break;
  case shape_Sine: {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
      y0 = b1 * y1 - y2;
      level = a2 - y0;
      y2 = y1;
      y1 = y0;
    }
  } break;
  case shape_Welch: {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
      y0 = b1 * y1 - y2;
      level = a2 + y0;
      y2 = y1;
      y1 = y0;
    }
  } break;
  case shape_Curve: {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
      b1 *= grow;
      level = a2 - b1;
    }
  } break;
  case shape_Squared: {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
      y1 += grow;
      level = y1 * y1;
    }
  } break;
  case shape_Cubed : {
    for (let i = 0; i < nsmps; i++) {
      if (!gateCheck(index)) {
        break;
      }
      out[index++] = level;
      y1 = Math.max(y1 + grow, 0);
      level = y1 * y1 * y1;
    }
  } break;
  case shape_Sustain : {
    for (let i = 0; i < nsmps; i++) {
      if (checkGateOnSustain) {
        if (gateCheck(index)) {
          out[index++] = level;
        }
      } else {
        out[index++] = level;
      }
    }
  } break;
  }

  unit._level = level;
  unit._grow = grow;
  unit._a2 = a2;
  unit._b1 = b1;
  unit._y2 = y2;
  unit._y1 = y1;

  return index;
}

dspProcess["aa"] = function(inNumSamples) {
  const checkGateAR = index => checkGate(this, index);

  let index = 0;

  while (index < inNumSamples) {
    if (this._counter <= 0) {
      if (!nextSegment(this)) {
        return;
      }
    }

    const nsmps = Math.min(inNumSamples - index, this._counter);

    index = perform(this, index, nsmps, checkGateAR, true);

    this._counter -= nsmps;
  }
};

dspProcess["ak"] = function(inNumSamples) {
  checkGate(this, 0);

  let index = 0;

  while (index < inNumSamples) {
    if (this._counter <= 0) {
      if (!nextSegment(this)) {
        return;
      }
    }

    const nsmps = Math.min(inNumSamples - index, this._counter);

    index = perform(this, index, nsmps, checkGateKR, false);

    this._counter -= nsmps;
  }
};

dspProcess["kk"] = function() {
  checkGate(this, 0);

  if (this._counter <= 0) {
    if (!nextSegment(this)) {
      return;
    }
  }

  perform(this, 0, 1, checkGateKR, false);

  this._counter -= 1;
};

SCUnitRepository.registerSCUnitClass("EnvGen", SCUnitEnvGen);

module.exports = SCUnitEnvGen;
