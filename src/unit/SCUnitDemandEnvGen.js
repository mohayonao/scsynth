"use strict";

const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const dspProcess = {};

const d_env_level = 0;
const d_env_dur = 1;
const d_env_shape = 2;
const d_env_curve = 3;
const d_env_gate = 4;
const d_env_reset = 5;
const d_env_levelScale = 6;
const d_env_levelBias = 7;
const d_env_timeScale = 8;
const d_env_doneAction = 9;

const shape_Step = 0;
const shape_Linear = 1;
const shape_Exponential = 2;
const shape_Sine = 3;
const shape_Welch = 4;
const shape_Curve = 5;
const shape_Squared = 6;
const shape_Cubed = 7;
const shape_Sustain = 9999

class SCUnitDemandEnvGen extends SCUnit {
  initialize(rate) {
    this._sampleRate = rate.sampleRate;
    this._sampleDur = rate.sampleDur;
    this._phase = 0;
    this._prevreset = 0;
    this._a1 = 0;
    this._a2 = 0;
    this._b1 = 0;
    this._y1 = 0;
    this._y2 = 0;
    this._grow = 0;
    this._level = demand.next(this, d_env_level, 1);
    if (Number.isNaN(this._level)) {
      this._level = 0;
    }
    this._endLevel = this._level;
    this._curve = 0;
    this._shape = 0;
    this._release = false;
    this._running = !!this.inputs[d_env_gate];

    if (this.inputSpecs[d_env_gate].rate === C.RATE_AUDIO) {
      this.dspProcess = dspProcess["k"];
    } else {
      this.dspProcess = dspProcess["k"];
    }

    this.process(1);
  }
}

dspProcess["k"] = function(inNumSamples) {
  const out = this.outputs[0];
  const resetIn = this.inputs[d_env_reset];

  let prevreset = this._prevreset;
  let level = this._level;
  let phase = this._phase;
  let curve = this._curve;
  let release = this._release;
  let running = this._running;
  let shape = this._shape;


  for (let i = 0; i < inNumSamples; i++) {
    const zreset = resetIn[i];

    if (0 < zreset && this._prevreset <= 0) {
      demand.reset(this, d_env_level);
      demand.reset(this, d_env_dur);
      demand.reset(this, d_env_shape);
      demand.reset(this, d_env_curve);

      if (zreset <= 1) {
        demand.next(this, d_env_level, 1);
      } else {
        level = demand.next(this, d_env_level, 1);
      }

      release = false;
      running = true;
      phase = 0;
    }

    prevreset = zreset;

    if (phase <= 0 && running) {
      if (release) {
        running = false;
        release = false;
        this.doneAction(this.inputs[d_env_doneAction][0]);
      } else {
        let dur = demand.next(this, d_env_dur, 1);

        if (Number.isNaN(dur)) {
          release = true;
          running = false;
          phase = Infinity;
        } else {
          phase = dur * this.inputs[d_env_timeScale][0] * this._sampleRate + phase;
        }

        let fshape = demand.next(this, d_env_shape, 1);

        if (Number.isNaN(fshape)) {
          shape = this._shape;
        } else {
          shape = fshape|0;
        }

        curve = demand.next(this, d_env_curve, 1);
        if (Number.isNaN(curve)) curve = this._curve;

        let count;

        if (phase <= 1) {
          shape = 1;
          count = 1;
        } else {
          count = phase;
        }

        if (dur * 0.5 < this._sampleDur) {
          shape = 1;
        }

        let endLevel = demand.next(this, d_env_level, 1);

        if (Number.isNaN(endLevel)) {
          endLevel = this._endLevel;
          release = true;
          phase = 0;
          shape = 0;
        } else  {
          endLevel = endLevel * this.inputs[d_env_levelScale][0] + this.inputs[d_env_levelBias][0];
          this._endLevel = endLevel;
        }

        switch (shape) {
        case shape_Step:
          level = endLevel;
          break;
        case shape_Linear:
          this._grow = (endLevel - level) / count;
          break;
        case shape_Exponential:
          this._grow = Math.pow(endLevel / level, 1.0 / count);
          break;
        case shape_Sine: {
          const w = Math.PI / count;

          this._a2 = (endLevel + level) * 0.5;
          this._b1 = 2. * Math.cos(w);
          this._y1 = (endLevel - level) * 0.5;
          this._y2 = this._y1 * Math.sin(Math.PI * 0.5 - w);
          level = this._a2 - this._y1;
        } break;
        case shape_Welch: {
          const w = (Math.PI * 0.5) / count;

          this._b1 = 2. * Math.cos(w);
          if (endLevel >= level) {
            this._a2 = level;
            this._y1 = 0.;
            this._y2 = -Math.sin(w) * (endLevel - level);
          } else {
            this._a2 = endLevel;
            this._y1 = level - endLevel;
            this._y2 = Math.cos(w) * (level - endLevel);
          }
          level = this._a2 + this._y1;
        } break;
        case shape_Curve:
          if (Math.abs(curve) < 0.001) {
            this._shape = shape = 1;
            this._grow = (endLevel - level) / count;
          } else {
            const a1 = (endLevel - level) / (1.0 - Math.exp(curve));

            this._a2 = level + a1;
            this._b1 = a1;

            this._grow = Math.exp(curve / Math.ceil(count));
          }
          break;
        case shape_Squared:
          this._y1 = Math.sqrt(level);
          this._y2 = Math.sqrt(endLevel);
          this._grow = (this._y2 - this._y1) / count;
          break;
        case shape_Cubed:
          this._y1 = Math.pow(level, 1/3);
          this._y2 = Math.pow(endLevel, 1/3);
          this._grow = (this._y2 - this._y1) / count;
          break;
        }
      }
    }

    if(running) {
      switch (shape) {
      case shape_Step:
        break;
      case shape_Linear:
        level += this._grow;
        break;
      case shape_Exponential:
        level *= this._grow;
        break;
      case shape_Sine: {
        const y0 = this._b1 * this._y1 - this._y2;

        level = this._a2 - y0;

        this._y1 = y0;
        this._y2 = this._y1;
      } break;
      case shape_Welch: {
        const y0 = this._b1 * this._y1 - this._y2;

        level = this._a2 + y0;

        this._y1 = y0;
        this._y2 = this._y1;
      } break;
      case shape_Curve: {
        this._b1 *= this._grow;
        level = this._a2 - this._b1;
      } break;
      case shape_Squared: {
        this._y1 += this._grow;
        level = this._y1 * this._y1;
      } break;
      case shape_Cubed: {
        this._y1 += this._grow;
        level = this._y1 * this._y1 * this._y1;
      } break;
      case shape_Sustain:
        break;
      }
      phase -= 1;
    }
    out[i] = level;
  }

  const zgate = this.inputs[d_env_gate][0];

  if (1 <= zgate) {
    this._running = true;
  } else if (zgate < 0) {
    this._running = true;
  } else {
    this._running = false;
  }

  this._level = level;
  this._curve = curve;
  this._shape = shape;
  this._prevreset = prevreset;
  this._release = release;
  this._phase = phase;
};

dspProcess["k"] = function(inNumSamples) {
  const out = this.outputs[0];
  const zreset = this.inputs[d_env_reset][0];

  let level = this._level;
  let phase = this._phase;
  let curve = this._curve;
  let release = this._release;
  let running = this._running;
  let shape = this._shape;

  if (0 < zreset && this._prevreset <= 0) {
    demand.reset(this, d_env_level);
    demand.reset(this, d_env_dur);
    demand.reset(this, d_env_shape);
    demand.reset(this, d_env_curve);

    if (zreset <= 1) {
      demand.next(this, d_env_level, 1);
    } else {
      level = demand.next(this, d_env_level, 1);
    }

    release = false;
    running = true;
    phase = 0;
  }

  for (let i = 0; i < inNumSamples; i++) {
    if (phase <= 0 && running) {
      if (release) {
        running = false;
        release = false;
        this.doneAction(this.inputs[d_env_doneAction][0]);
      } else {
        let dur = demand.next(this, d_env_dur, 1);

        if (Number.isNaN(dur)) {
          release = true;
          running = false;
          phase = Infinity;
        } else {
          phase = dur * this.inputs[d_env_timeScale][0] * this._sampleRate + phase;
        }

        let fshape = demand.next(this, d_env_shape, 1);

        if (Number.isNaN(fshape)) {
          shape = this._shape;
        } else {
          shape = fshape|0;
        }

        curve = demand.next(this, d_env_curve, 1);
        if (Number.isNaN(curve)) curve = this._curve;

        let count;

        if (phase <= 1) {
          shape = 1;
          count = 1;
        } else {
          count = phase;
        }

        if (dur * 0.5 < this._sampleDur) {
          shape = 1;
        }

        let endLevel = demand.next(this, d_env_level, 1);

        if (Number.isNaN(endLevel)) {
          endLevel = this._endLevel;
          release = true;
          phase = 0;
          shape = 0;
        } else  {
          endLevel = endLevel * this.inputs[d_env_levelScale][0] + this.inputs[d_env_levelBias][0];
          this._endLevel = endLevel;
        }

        switch (shape) {
        case shape_Step:
          level = endLevel;
          break;
        case shape_Linear:
          this._grow = (endLevel - level) / count;
          break;
        case shape_Exponential:
          this._grow = Math.pow(endLevel / level, 1.0 / count);
          break;
        case shape_Sine: {
          const w = Math.PI / count;

          this._a2 = (endLevel + level) * 0.5;
          this._b1 = 2. * Math.cos(w);
          this._y1 = (endLevel - level) * 0.5;
          this._y2 = this._y1 * Math.sin(Math.PI * 0.5 - w);
          level = this._a2 - this._y1;
        } break;
        case shape_Welch: {
          const w = (Math.PI * 0.5) / count;

          this._b1 = 2. * Math.cos(w);
          if (endLevel >= level) {
            this._a2 = level;
            this._y1 = 0.;
            this._y2 = -Math.sin(w) * (endLevel - level);
          } else {
            this._a2 = endLevel;
            this._y1 = level - endLevel;
            this._y2 = Math.cos(w) * (level - endLevel);
          }
          level = this._a2 + this._y1;
        } break;
        case shape_Curve:
          if (Math.abs(curve) < 0.001) {
            this._shape = shape = 1;
            this._grow = (endLevel - level) / count;
          } else {
            const a1 = (endLevel - level) / (1.0 - Math.exp(curve));

            this._a2 = level + a1;
            this._b1 = a1;

            this._grow = Math.exp(curve / Math.ceil(count));
          }
          break;
        case shape_Squared:
          this._y1 = Math.sqrt(level);
          this._y2 = Math.sqrt(endLevel);
          this._grow = (this._y2 - this._y1) / count;
          break;
        case shape_Cubed:
          this._y1 = Math.pow(level, 1/3);
          this._y2 = Math.pow(endLevel, 1/3);
          this._grow = (this._y2 - this._y1) / count;
          break;
        }
      }
    }

    if(running) {
      switch (shape) {
      case shape_Step:
        break;
      case shape_Linear:
        level += this._grow;
        break;
      case shape_Exponential:
        level *= this._grow;
        break;
      case shape_Sine: {
        const y0 = this._b1 * this._y1 - this._y2;

        level = this._a2 - y0;

        this._y1 = y0;
        this._y2 = this._y1;
      } break;
      case shape_Welch: {
        const y0 = this._b1 * this._y1 - this._y2;

        level = this._a2 + y0;

        this._y1 = y0;
        this._y2 = this._y1;
      } break;
      case shape_Curve: {
        this._b1 *= this._grow;
        level = this._a2 - this._b1;
      } break;
      case shape_Squared: {
        this._y1 += this._grow;
        level = this._y1 * this._y1;
      } break;
      case shape_Cubed: {
        this._y1 += this._grow;
        level = this._y1 * this._y1 * this._y1;
      } break;
      case shape_Sustain:
        break;
      }
      phase -= 1;
    }
    out[i] = level;
  }

  const zgate = this.inputs[d_env_gate][0];

  if (1 <= zgate) {
    this._running = true;
  } else if (zgate < 0) {
    this._running = true;
  } else {
    this._running = false;
  }

  this._level = level;
  this._curve = curve;
  this._shape = shape;
  this._prevreset = zreset;
  this._release = release;
  this._phase = phase;
};

SCUnitRepository.registerSCUnitClass("DemandEnvGen", SCUnitDemandEnvGen);

module.exports = SCUnitDemandEnvGen;
