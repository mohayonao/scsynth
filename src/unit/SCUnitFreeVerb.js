"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const clamp = require("../util/clamp");
const dspProcess = {};

class SCUnitFreeVerb extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["akkk"];

    this._iota0 = 0;
    this._iota1 = 0;
    this._iota2 = 0;
    this._iota3 = 0;
    this._iota4 = 0;
    this._iota5 = 0;
    this._iota6 = 0;
    this._iota7 = 0;
    this._iota8 = 0;
    this._iota9 = 0;
    this._iota10 = 0;
    this._iota11 = 0;
    this._R0_0 = 0;
    this._R1_0 = 0;
    this._R2_0 = 0;
    this._R3_0 = 0;
    this._R4_0 = 0;
    this._R5_0 = 0;
    this._R6_0 = 0;
    this._R7_0 = 0;
    this._R8_0 = 0;
    this._R9_0 = 0;
    this._R10_0 = 0;
    this._R11_0 = 0;
    this._R12_0 = 0;
    this._R13_0 = 0;
    this._R14_0 = 0;
    this._R15_0 = 0;
    this._R16_0 = 0;
    this._R17_0 = 0;
    this._R18_0 = 0;
    this._R19_0 = 0;
    this._R0_1 = 0;
    this._R1_1 = 0;
    this._R2_1 = 0;
    this._R3_1 = 0;
    this._dline0 = new Float32Array(225);
    this._dline1 = new Float32Array(341);
    this._dline2 = new Float32Array(441);
    this._dline3 = new Float32Array(556);
    this._dline4 = new Float32Array(1617);
    this._dline5 = new Float32Array(1557);
    this._dline6 = new Float32Array(1491);
    this._dline7 = new Float32Array(1422);
    this._dline8 = new Float32Array(1277);
    this._dline9 = new Float32Array(1116);
    this._dline10 = new Float32Array(1188);
    this._dline11 = new Float32Array(1356);

    this.dspProcess(1);
  }
}

dspProcess["akkk"] = function(inNumSamples) {
  const out = this.outputs[0];
  const inIn = this.inputs[0];
  const mix = clamp(this.inputs[1][0], 0, 1);
  const room = clamp(this.inputs[2][0], 0, 1);
  const damp = clamp(this.inputs[3][0], 0, 1);
  const ftemp0 = mix;
  const ftemp1 = (1 - ftemp0);
  const ftemp5 = (0.7 + (0.28 * room));
  const ftemp6 = (0.4 * damp);
  const ftemp7 = (1 - ftemp6);
  const dline0 = this._dline0;
  const dline1 = this._dline1;
  const dline2 = this._dline2;
  const dline3 = this._dline3;
  const dline4 = this._dline4;
  const dline5 = this._dline5;
  const dline6 = this._dline6;
  const dline7 = this._dline7;
  const dline8 = this._dline8;
  const dline9 = this._dline9;
  const dline10 = this._dline10;
  const dline11 = this._dline11;

  let iota0 = this._iota0;
  let iota1 = this._iota1;
  let iota2 = this._iota2;
  let iota3 = this._iota3;
  let iota4 = this._iota4;
  let iota5 = this._iota5;
  let iota6 = this._iota6;
  let iota7 = this._iota7;
  let iota8 = this._iota8;
  let iota9 = this._iota9;
  let iota10 = this._iota10;
  let iota11 = this._iota11;
  let R0_0 = this._R0_0;
  let R1_0 = this._R1_0;
  let R2_0 = this._R2_0;
  let R3_0 = this._R3_0;
  let R4_0 = this._R4_0;
  let R5_0 = this._R5_0;
  let R6_0 = this._R6_0;
  let R7_0 = this._R7_0;
  let R8_0 = this._R8_0;
  let R9_0 = this._R9_0;
  let R10_0 = this._R10_0;
  let R11_0 = this._R11_0;
  let R12_0 = this._R12_0;
  let R13_0 = this._R13_0;
  let R14_0 = this._R14_0;
  let R15_0 = this._R15_0;
  let R16_0 = this._R16_0;
  let R17_0 = this._R17_0;
  let R18_0 = this._R18_0;
  let R19_0 = this._R19_0;
  let R0_1 = this._R0_1;
  let R1_1 = this._R1_1;
  let R2_1 = this._R2_1;
  let R3_1 = this._R3_1;

  for (let i = 0; i < inNumSamples; i++) {
    const ftemp2 = inIn[i];
    const ftemp4 = 0.015 * ftemp2;

    iota0 = ++iota0 % 225;
    iota1 = ++iota1 % 341;
    iota2 = ++iota2 % 441;
    iota3 = ++iota3 % 556;
    iota4 = ++iota4 % 1617;
    iota5 = ++iota5 % 1557;
    iota6 = ++iota6 % 1491;
    iota7 = ++iota7 % 1422;
    iota8 = ++iota8 % 1277;
    iota9 = ++iota9 % 1116;
    iota10 = ++iota10 % 1188;
    iota11 = ++iota11 % 1356;

    const T0 = dline0[iota0];
    const T1 = dline1[iota1];
    const T2 = dline2[iota2];
    const T3 = dline3[iota3];
    const T4 = dline4[iota4];
    const T5 = dline5[iota5];
    const T6 = dline6[iota6];
    const T7 = dline7[iota7];
    const T8 = dline8[iota8];
    const T9 = dline9[iota9];
    const T10 = dline10[iota10];
    const T11 = dline11[iota11];

    R5_0 = ftemp7 * R4_0 + ftemp6 * R5_0;
    dline4[iota4] = ftemp4 + ftemp5 * R5_0;
    R4_0 = T4;

    R7_0 = ftemp7 * R6_0 + ftemp6 * R7_0;
    dline5[iota5] = ftemp4 + ftemp5 * R7_0;
    R6_0 = T5;

    R9_0 = ftemp7 * R8_0 + ftemp6 * R9_0;
    dline6[iota6] = ftemp4 + ftemp5 * R9_0;
    R8_0 = T6;

    R11_0 = ftemp7 * R10_0 + ftemp6 * R11_0;
    dline7[iota7] = ftemp4 + ftemp5 * R11_0;
    R10_0 = T7;

    R13_0 = ftemp7 * R12_0 + ftemp6 * R13_0;
    dline8[iota8] = ftemp4 + ftemp5 * R13_0;
    R12_0 = T8;

    R15_0 = ftemp7 * R14_0 + ftemp6 * R15_0;
    dline9[iota9] = ftemp4 + ftemp5 * R15_0;
    R14_0 = T9;

    R17_0 = ftemp7 * R16_0 + ftemp6 * R17_0;
    dline10[iota10] = ftemp4 + ftemp5 * R17_0;
    R16_0 = T10;

    R19_0 = ftemp7 * R18_0 + ftemp6 * R19_0;
    dline11[iota11] = ftemp4 + ftemp5 * R19_0;
    R18_0 = T11;

    dline3[iota3] = 0.5 * R3_0 + R4_0 + (R6_0 + R8_0) + (R10_0 + R12_0 + (R14_0 + (R16_0 + R18_0)));
    R3_0 = T3;

    R3_1 = R3_0 - (R4_0 + R6_0 + (R8_0 + R10_0) + (R12_0 + R14_0 + (R16_0 + R18_0)));
    dline2[iota2] = 0.5 * R2_0 + R3_1;
    R2_0 = T2;

    R2_1 = R2_0 - R3_1;
    dline1[iota1] = 0.5 * R1_0 + R2_1;
    R1_0 = T1;

    R1_1 = R1_0 - R2_1;
    dline0[iota0] = 0.5 * R0_0 + R1_1;
    R0_0 = T0;

    R0_1 = R0_0 - R1_1;
    out[i] = ftemp1 * ftemp2 + ftemp0 * R0_1;
  }

  this._iota0 = iota0;
  this._iota1 = iota1;
  this._iota2 = iota2;
  this._iota3 = iota3;
  this._iota4 = iota4;
  this._iota5 = iota5;
  this._iota6 = iota6;
  this._iota7 = iota7;
  this._iota8 = iota8;
  this._iota9 = iota9;
  this._iota10 = iota10;
  this._iota11 = iota11;
  this._R0_1 = R0_1;
  this._R1_1 = R1_1;
  this._R2_1 = R2_1;
  this._R3_1 = R3_1;
  this._R0_0 = R0_0;
  this._R1_0 = R1_0;
  this._R2_0 = R2_0;
  this._R3_0 = R3_0;
  this._R4_0 = R4_0;
  this._R5_0 = R5_0;
  this._R6_0 = R6_0;
  this._R7_0 = R7_0;
  this._R8_0 = R8_0;
  this._R9_0 = R9_0;
  this._R10_0 = R10_0;
  this._R11_0 = R11_0;
  this._R12_0 = R12_0;
  this._R13_0 = R13_0;
  this._R14_0 = R14_0;
  this._R15_0 = R15_0;
  this._R16_0 = R16_0;
  this._R17_0 = R17_0;
  this._R18_0 = R18_0;
  this._R19_0 = R19_0;
};

SCUnitRepository.registerSCUnitClass("FreeVerb", SCUnitFreeVerb);

module.exports = SCUnitFreeVerb;
