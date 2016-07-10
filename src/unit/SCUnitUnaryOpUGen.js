"use strict";
const C = require("../Constants");
const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const demand = require("./_demand");
const $i2n = `
neg not isNil notNil bitNot abs asFloat asInt ceil floor frac sign squared cubed sqrt exp reciprocal
midicps cpsmidi midiratio ratiomidi dbamp ampdb octcps cpsoct log log2 log10 sin cos tan asin acos
atan sinh cosh tanh rand rand2 linrand bilinrand sum3rand distort softclip coin digitvalue silence
thru rectWindow hanWindow welWindow triWindow ramp scurve numunaryselectors num tilde pi to_i half
twice`.trim().split(/\s/);
const $r2k = [
  "i",
  "k",
  "a"
];
const dspProcess = {};
class SCUnitUnaryOpUGen extends SCUnit {
  initialize() {
    const dspFunc = dspProcess[$i2n[this.specialIndex]];
    if (!dspFunc) {
      throw new Error(`UnaryOpUGen[${ $i2n[this.specialIndex] }] is not defined.`);
    }
    if (this.calcRate === C.RATE_DEMAND) {
      this.dspProcess = dspFunc["d"];
    } else {
      this.dspProcess = dspFunc[$r2k[this.inputSpecs[0].rate]] || null;
      this._a = this.inputs[0][0];
      if (this.dspProcess) {
        this.dspProcess(1);
      } else {
        this.outputs[0][0] = dspFunc(this._a);
      }
    }
  }
}
dspProcess["neg"] = function (a) {
  return -a;
};
dspProcess["not"] = function (a) {
  return a === 0 ? 1 : 0;
};
dspProcess["abs"] = function (a) {
  return Math.abs(a);
};
dspProcess["ceil"] = function (a) {
  return Math.ceil(a);
};
dspProcess["floor"] = function (a) {
  return Math.floor(a);
};
dspProcess["frac"] = function (a) {
  if (a < 0) {
    return 1 + (a - (a | 0));
  }
  return a - (a | 0);
};
dspProcess["sign"] = function (a) {
  return Math.sign(a);
};
dspProcess["squared"] = function (a) {
  return a * a;
};
dspProcess["cubed"] = function (a) {
  return a * a * a;
};
dspProcess["sqrt"] = function (a) {
  return Math.sqrt(Math.abs(a));
};
dspProcess["exp"] = function (a) {
  return Math.exp(a);
};
dspProcess["reciprocal"] = function (a) {
  return 1 / a;
};
dspProcess["midicps"] = function (a) {
  return 440 * Math.pow(2, (a - 69) * 1 / 12);
};
dspProcess["cpsmidi"] = function (a) {
  return Math.log(Math.abs(a) * 1 / 440) * Math.LOG2E * 12 + 69;
};
dspProcess["midiratio"] = function (a) {
  return Math.pow(2, a * 1 / 12);
};
dspProcess["ratiomidi"] = function (a) {
  return Math.log(Math.abs(a)) * Math.LOG2E * 12;
};
dspProcess["dbamp"] = function (a) {
  return Math.pow(10, a * 0.05);
};
dspProcess["ampdb"] = function (a) {
  return Math.log(Math.abs(a)) * Math.LOG10E * 20;
};
dspProcess["octcps"] = function (a) {
  return 440 * Math.pow(2, a - 4.75);
};
dspProcess["cpsoct"] = function (a) {
  return Math.log(Math.abs(a) * 1 / 440) * Math.LOG2E + 4.75;
};
dspProcess["log"] = function (a) {
  return Math.log(Math.abs(a));
};
dspProcess["log2"] = function (a) {
  return Math.log(Math.abs(a)) * Math.LOG2E;
};
dspProcess["log10"] = function (a) {
  return Math.log(Math.abs(a)) * Math.LOG10E;
};
dspProcess["sin"] = function (a) {
  return Math.sin(a);
};
dspProcess["cos"] = function (a) {
  return Math.cos(a);
};
dspProcess["tan"] = function (a) {
  return Math.tan(a);
};
dspProcess["asin"] = function (a) {
  return Math.asin(Math.max(-1, Math.min(a, 1)));
};
dspProcess["acos"] = function (a) {
  return Math.acos(Math.max(-1, Math.min(a, 1)));
};
dspProcess["atan"] = function (a) {
  return Math.atan(a);
};
dspProcess["sinh"] = function (a) {
  return Math.sinh(a);
};
dspProcess["cosh"] = function (a) {
  return Math.cosh(a);
};
dspProcess["tanh"] = function (a) {
  return Math.tanh(a);
};
dspProcess["rand"] = function (a) {
  return Math.random() * a;
};
dspProcess["rand2"] = function (a) {
  return (Math.random() * 2 - 1) * a;
};
dspProcess["linrand"] = function (a) {
  return Math.min(Math.random(), Math.random()) * a;
};
dspProcess["bilinrand"] = function (a) {
  return (Math.random() - Math.random()) * a;
};
dspProcess["sum3rand"] = function (a) {
  return (Math.random() + Math.random() + Math.random() - 1.5) * 0.666666667 * a;
};
dspProcess["distort"] = function (a) {
  return a / (1 + Math.abs(a));
};
dspProcess["softclip"] = function (a) {
  const absa = Math.abs(a);
  return absa <= 0.5 ? a : (absa - 0.25) / a;
};
dspProcess["coin"] = function (a) {
  return Math.random() < a ? 1 : 0;
};
dspProcess["num"] = function (a) {
  return +a;
};
dspProcess["tilde"] = function (a) {
  return ~a;
};
dspProcess["pi"] = function (a) {
  return Math.PI * a;
};
dspProcess["to_i"] = function (a) {
  return a | 0;
};
dspProcess["half"] = function (a) {
  return a * 0.5;
};
dspProcess["twice"] = function (a) {
  return a * 2;
};
function unary_k(func) {
  return function () {
    this.outputs[0][0] = func(this.inputs[0][0]);
  };
}
function unary_a(func) {
  return function (inNumSamples) {
    const out = this.outputs[0];
    const aIn = this.inputs[0];
    for (let i = 0; i < inNumSamples; i++) {
      out[i] = func(aIn[i]);
    }
  };
}
function unary_d(func) {
  return function (inNumSamples) {
    if (inNumSamples) {
      const a = demand.next(this, 0, inNumSamples);
      this.outputs[0][0] = isNaN(a) ? NaN : func(a);
    } else {
      demand.reset(this, 0);
    }
  };
}
Object.keys(dspProcess).forEach(key => {
  const func = dspProcess[key];
  func["a"] = func["a"] || unary_a(func);
  func["k"] = func["k"] || unary_k(func);
  func["d"] = unary_d(func);
});
SCUnitRepository.registerSCUnitClass("UnaryOpUGen", SCUnitUnaryOpUGen);
module.exports = SCUnitUnaryOpUGen;
