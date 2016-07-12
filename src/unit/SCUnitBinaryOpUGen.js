"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const sc_wrap = require("../util/sc_wrap");
const sc_fold = require("../util/sc_fold");
const $i2n = `
+ - * / / % eq ne lt gt le ge min max bitAnd bitOr bitXor lcm gcd round roundUp trunc atan2 hypot
hypotApx pow leftShift rightShift unsignedRightShift fill ring1 ring2 ring3 ring4 difsqr sumsqr
sqrsum sqrdif absdif thresh amclip scaleneg clip2 excess fold2 wrap2 firstarg randrange exprandrange
numbinaryselectors roundDown`.trim().split(/\s/);
const dspProcess = {};
class SCUnitBinaryOpUGen extends SCUnit {
  initialize(rate) {
    const dspFunc = dspProcess[$i2n[this.specialIndex]];
    if (!dspFunc) {
      throw new Error(`BinaryOpUGen[${ $i2n[this.specialIndex] }] is not defined.`);
    }
    this._slopeFactor = rate.slopeFactor;
    if (this.calcRate === C.RATE_DEMAND) {
      this.dspProcess = dspFunc["dd"];
    } else {
      this.dspProcess = dspFunc[$r2k(this.inputSpecs)];
      this._a = this.inputs[0][0];
      this._b = this.inputs[1][0];
      if (this.dspProcess) {
        this.dspProcess(1);
      } else {
        this.outputs[0][0] = dspFunc(this._a, this._b);
      }
    }
  }
}
function $r2k(inputSpecs) {
  return inputSpecs.map(x => x.rate === C.RATE_AUDIO ? "a" : x.rate === C.RATE_SCALAR ? "i" : "k").join("");
}
function gcd(a, b) {
  a = Math.floor(a);
  b = Math.floor(b);
  while (b !== 0) {
    [a, b] = [
      b,
      a % b
    ];
  }
  return Math.abs(a);
}
dspProcess["+"] = function (a, b) {
  return a + b;
};
dspProcess["-"] = function (a, b) {
  return a - b;
};
dspProcess["*"] = function (a, b) {
  return a * b;
};
dspProcess["/"] = function (a, b) {
  return b === 0 ? 0 : a / b;
};
dspProcess["%"] = function (a, b) {
  return b === 0 ? 0 : a % b;
};
dspProcess["eq"] = function (a, b) {
  return a === b ? 1 : 0;
};
dspProcess["ne"] = function (a, b) {
  return a !== b ? 1 : 0;
};
dspProcess["lt"] = function (a, b) {
  return a < b ? 1 : 0;
};
dspProcess["gt"] = function (a, b) {
  return a > b ? 1 : 0;
};
dspProcess["le"] = function (a, b) {
  return a <= b ? 1 : 0;
};
dspProcess["ge"] = function (a, b) {
  return a >= b ? 1 : 0;
};
dspProcess["bitAnd"] = function (a, b) {
  return a & b;
};
dspProcess["bitOr"] = function (a, b) {
  return a | b;
};
dspProcess["bitXor"] = function (a, b) {
  return a ^ b;
};
dspProcess["min"] = function (a, b) {
  return Math.min(a, b);
};
dspProcess["max"] = function (a, b) {
  return Math.max(a, b);
};
dspProcess["lcm"] = function (a, b) {
  if (a === 0 && b === 0) {
    return 0;
  }
  return Math.abs(a * b) / gcd(a, b);
};
dspProcess["gcd"] = function (a, b) {
  return gcd(a, b);
};
dspProcess["round"] = function (a, b) {
  return b === 0 ? a : Math.round(a / b) * b;
};
dspProcess["roundUp"] = function (a, b) {
  return b === 0 ? a : Math.ceil(a / b) * b;
};
dspProcess["roundDown"] = function (a, b) {
  return b === 0 ? a : Math.floor(a / b) * b;
};
dspProcess["trunc"] = function (a, b) {
  return b === 0 ? a : Math.floor(a / b) * b;
};
dspProcess["atan2"] = function (a, b) {
  return Math.atan2(a, b);
};
dspProcess["hypot"] = function (a, b) {
  return Math.sqrt(a * a + b * b);
};
dspProcess["hypotApx"] = function (a, b) {
  const x = Math.abs(a);
  const y = Math.abs(b);
  const minxy = Math.min(x, y);
  return x + y - (Math.sqrt(2) - 1) * minxy;
};
dspProcess["pow"] = function (a, b) {
  return Math.pow(Math.abs(a), b);
};
dspProcess["leftShift"] = function (a, b) {
  if (b < 0) {
    return (a | 0) >> (-b | 0);
  }
  return (a | 0) << (b | 0);
};
dspProcess["rightShift"] = function (a, b) {
  if (b < 0) {
    return (a | 0) << (-b | 0);
  }
  return (a | 0) >> (b | 0);
};
dspProcess["unsignedRightShift"] = function (a, b) {
  if (b < 0) {
    return (a | 0) << (-b | 0);
  }
  return (a | 0) >> (b | 0);
};
dspProcess["ring1"] = function (a, b) {
  return a * b + a;
};
dspProcess["ring2"] = function (a, b) {
  return a * b + a + b;
};
dspProcess["ring3"] = function (a, b) {
  return a * a * b;
};
dspProcess["ring4"] = function (a, b) {
  return a * a * b - a * b * b;
};
dspProcess["difsqr"] = function (a, b) {
  return a * a - b * b;
};
dspProcess["sumsqr"] = function (a, b) {
  return a * a + b * b;
};
dspProcess["sqrsum"] = function (a, b) {
  return (a + b) * (a + b);
};
dspProcess["sqrdif"] = function (a, b) {
  return (a - b) * (a - b);
};
dspProcess["absdif"] = function (a, b) {
  return Math.abs(a - b);
};
dspProcess["thresh"] = function (a, b) {
  return a < b ? 0 : a;
};
dspProcess["amclip"] = function (a, b) {
  return a * 0.5 * (b + Math.abs(b));
};
dspProcess["scaleneg"] = function (a, b) {
  b = 0.5 * b + 0.5;
  return (Math.abs(a) - a) * b + a;
};
dspProcess["clip2"] = function (a, b) {
  return Math.max(-b, Math.min(a, b));
};
dspProcess["excess"] = function (a, b) {
  return a - Math.max(-b, Math.min(a, b));
};
dspProcess["fold2"] = function (val, hi) {
  return sc_fold(val, -hi, hi);
};
dspProcess["wrap2"] = function (val, hi) {
  return sc_wrap(val, -hi, hi);
};
dspProcess["+"]["aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const bIn = this.inputs[1];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] + bIn[i];
  }
};
dspProcess["+"]["ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const b = this._b;
  const nextB = this.inputs[1][0];
  const bSlope = (nextB - this._b) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] + (b + bSlope * i);
  }
  this._b = nextB;
};
dspProcess["+"]["ai"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const b = this._b;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] + b;
  }
};
dspProcess["+"]["ka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const a = this._a;
  const bIn = this.inputs[1];
  const nextA = this.inputs[0][0];
  const aSlope = (nextA - this._a) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = a + aSlope * i + bIn[i];
  }
  this._a = nextA;
};
dspProcess["+"]["kk"] = function () {
  this.outputs[0][0] = this.inputs[0][0] + this.inputs[1][0];
};
dspProcess["+"]["ki"] = function () {
  this.outputs[0][0] = this.inputs[0][0] + this._b;
};
dspProcess["+"]["ia"] = function (inNumSamples) {
  const out = this.outputs[0];
  const a = this._a;
  const bIn = this.inputs[1];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = a + bIn[i];
  }
};
dspProcess["+"]["ik"] = function () {
  this.outputs[0][0] = this._a + this.inputs[1][0];
};
dspProcess["-"]["aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const bIn = this.inputs[1];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] - bIn[i];
  }
};
dspProcess["-"]["ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const b = this._b;
  const nextB = this.inputs[1][0];
  const bSlope = (nextB - this._b) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] - (b + bSlope * i);
  }
  this._b = nextB;
};
dspProcess["-"]["ai"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const b = this._b;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] - b;
  }
};
dspProcess["-"]["ka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const a = this._a;
  const bIn = this.inputs[1];
  const nextA = this.inputs[0][0];
  const aSlope = (nextA - this._a) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = a + aSlope * i - bIn[i];
  }
  this._a = nextA;
};
dspProcess["-"]["kk"] = function () {
  this.outputs[0][0] = this.inputs[0][0] - this.inputs[1][0];
};
dspProcess["-"]["ki"] = function () {
  this.outputs[0][0] = this.inputs[0][0] - this._b;
};
dspProcess["-"]["ia"] = function (inNumSamples) {
  const out = this.outputs[0];
  const a = this._a;
  const bIn = this.inputs[1];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = a - bIn[i];
  }
};
dspProcess["-"]["ik"] = function () {
  this.outputs[0][0] = this._a - this.inputs[1][0];
};
dspProcess["*"]["aa"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const bIn = this.inputs[1];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] * bIn[i];
  }
};
dspProcess["*"]["ak"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const b = this._b;
  const nextB = this.inputs[1][0];
  const bSlope = (nextB - this._b) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] * (b + bSlope * i);
  }
  this._b = nextB;
};
dspProcess["*"]["ai"] = function (inNumSamples) {
  const out = this.outputs[0];
  const aIn = this.inputs[0];
  const b = this._b;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = aIn[i] * b;
  }
};
dspProcess["*"]["ka"] = function (inNumSamples) {
  const out = this.outputs[0];
  const a = this._a;
  const bIn = this.inputs[1];
  const nextA = this.inputs[0][0];
  const aSlope = (nextA - this._a) * this._slopeFactor;
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = (a + aSlope * i) * bIn[i];
  }
  this._a = nextA;
};
dspProcess["*"]["kk"] = function () {
  this.outputs[0][0] = this.inputs[0][0] * this.inputs[1][0];
};
dspProcess["*"]["ki"] = function () {
  this.outputs[0][0] = this.inputs[0][0] * this._b;
};
dspProcess["*"]["ia"] = function (inNumSamples) {
  const out = this.outputs[0];
  const a = this._a;
  const bIn = this.inputs[1];
  for (let i = 0; i < inNumSamples; i++) {
    out[i] = a * bIn[i];
  }
};
dspProcess["*"]["ik"] = function () {
  this.outputs[0][0] = this._a * this.inputs[1][0];
};
function binary_aa(func) {
  return function (inNumSamples) {
    const out = this.outputs[0];
    const aIn = this.inputs[0];
    const bIn = this.inputs[1];
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = func(aIn[i], bIn[i]);
    }
  };
}
function binary_ak(func) {
  return function (inNumSamples) {
    const out = this.outputs[0];
    const aIn = this.inputs[0];
    const b = this._b;
    const nextB = this.inputs[1][0];
    const bSlope = (nextB - this._b) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = func(aIn[i], b + bSlope * i);
    }
    this._b = nextB;
  };
}
function binary_ai(func) {
  return function (inNumSamples) {
    const out = this.outputs[0];
    const aIn = this.inputs[0];
    const b = this._b;
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = func(aIn[i], b);
    }
  };
}
function binary_ka(func) {
  return function (inNumSamples) {
    const out = this.outputs[0];
    const a = this._a;
    const bIn = this.inputs[1];
    const nextA = this.inputs[0][0];
    const aSlope = (nextA - this._a) * this._slopeFactor;
    for (let i = 0; i < inNumSamples; i += 8) {
      out[i] = func(a + aSlope * i, bIn[i]);
    }
    this._a = nextA;
  };
}
function binary_kk(func) {
  return function () {
    this.outputs[0][0] = func(this.inputs[0][0], this.inputs[1][0]);
  };
}
function binary_ki(func) {
  return function () {
    this.outputs[0][0] = func(this.inputs[0][0], this._b);
  };
}
function binary_ia(func) {
  return function (inNumSamples) {
    const out = this.outputs[0];
    const a = this._a;
    const bIn = this.inputs[1];
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = func(a, bIn[i]);
    }
  };
}
function binary_ik(func) {
  return function () {
    this.outputs[0][0] = func(this._a, this.inputs[1][0]);
  };
}
function binary_dd(func) {
  return function (inNumSamples) {
    if (inNumSamples) {
      const a = demand.next(this, 0, inNumSamples);
      const b = demand.next(this, 1, inNumSamples);
      this.outputs[0][0] = isNaN(a) || isNaN(b) ? NaN : func(a, b);
    } else {
      demand.reset(this, 0);
      demand.reset(this, 1);
    }
  };
}
Object.keys(dspProcess).forEach(key => {
  const func = dspProcess[key];
  func["aa"] = func["aa"] || binary_aa(func);
  func["ak"] = func["ak"] || binary_ak(func);
  func["ai"] = func["ai"] || binary_ai(func);
  func["ka"] = func["ka"] || binary_ka(func);
  func["kk"] = func["kk"] || binary_kk(func);
  func["ki"] = func["ki"] || binary_ki(func);
  func["ia"] = func["ia"] || binary_ia(func);
  func["ik"] = func["ik"] || binary_ik(func);
  func["dd"] = binary_dd(func);
});
SCUnitRepository.registerSCUnitClass("BinaryOpUGen", SCUnitBinaryOpUGen);
module.exports = SCUnitBinaryOpUGen;
