"use strict";

const SCUnit = require("../SCUnit");
const SCUnitRepository = require("../SCUnitRepository");
const clamp = require("../util/clamp");
const dspProcess = {};

class SCUnitFreeVerb2 extends SCUnit {
  initialize() {
    this.dspProcess = dspProcess["aakkk"];

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
    this._iota12 = 0;
    this._iota13 = 0;
    this._iota14 = 0;
    this._iota15 = 0;
    this._iota16 = 0;
    this._iota17 = 0;
    this._iota18 = 0;
    this._iota19 = 0;
    this._iota20 = 0;
    this._iota21 = 0;
    this._iota22 = 0;
    this._iota23 = 0;
    this._R0_1 = 0;
    this._R1_1 = 0;
    this._R2_1 = 0;
    this._R3_1 = 0;
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
    this._R20_0 = 0;
    this._R21_0 = 0;
    this._R22_0 = 0;
    this._R23_0 = 0;
    this._R24_0 = 0;
    this._R25_0 = 0;
    this._R26_0 = 0;
    this._R27_0 = 0;
    this._R28_0 = 0;
    this._R29_0 = 0;
    this._R30_0 = 0;
    this._R31_0 = 0;
    this._R32_0 = 0;
    this._R33_0 = 0;
    this._R34_0 = 0;
    this._R35_0 = 0;
    this._R36_0 = 0;
    this._R37_0 = 0;
    this._R38_0 = 0;
    this._R39_0 = 0;
    this._R20_1 = 0;
    this._R21_1 = 0;
    this._R22_1 = 0;
    this._R23_1 = 0;
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
    this._dline12 = new Float32Array(248);
    this._dline13 = new Float32Array(364);
    this._dline14 = new Float32Array(464);
    this._dline15 = new Float32Array(579);
    this._dline16 = new Float32Array(1640);
    this._dline17 = new Float32Array(1580);
    this._dline18 = new Float32Array(1514);
    this._dline19 = new Float32Array(1445);
    this._dline20 = new Float32Array(1300);
    this._dline21 = new Float32Array(1139);
    this._dline22 = new Float32Array(1211);
    this._dline23 = new Float32Array(1379);
  }
}

dspProcess["aakkk"] = function(inNumSamples) {
  const outL = this.outputs[0];
  const outR = this.outputs[1];
  const inInL = this.inputs[0];
  const inInR = this.inputs[1];
  const mix =  clamp(this.inputs[2][0], 0, 1);
  const room = clamp(this.inputs[3][0], 0, 1);
  const damp = clamp(this.inputs[4][0], 0, 1);
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
  const dline12 = this._dline12;
  const dline13 = this._dline13;
  const dline14 = this._dline14;
  const dline15 = this._dline15;
  const dline16 = this._dline16;
  const dline17 = this._dline17;
  const dline18 = this._dline18;
  const dline19 = this._dline19;
  const dline20 = this._dline20;
  const dline21 = this._dline21;
  const dline22 = this._dline22;
  const dline23 = this._dline23;

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
  let iota12 = this._iota12;
  let iota13 = this._iota13;
  let iota14 = this._iota14;
  let iota15 = this._iota15;
  let iota16 = this._iota16;
  let iota17 = this._iota17;
  let iota18 = this._iota18;
  let iota19 = this._iota19;
  let iota20 = this._iota20;
  let iota21 = this._iota21;
  let iota22 = this._iota22;
  let iota23 = this._iota23;
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
  let R20_0 = this._R20_0;
  let R21_0 = this._R21_0;
  let R22_0 = this._R22_0;
  let R23_0 = this._R23_0;
  let R24_0 = this._R24_0;
  let R25_0 = this._R25_0;
  let R26_0 = this._R26_0;
  let R27_0 = this._R27_0;
  let R28_0 = this._R28_0;
  let R29_0 = this._R29_0;
  let R30_0 = this._R30_0;
  let R31_0 = this._R31_0;
  let R32_0 = this._R32_0;
  let R33_0 = this._R33_0;
  let R34_0 = this._R34_0;
  let R35_0 = this._R35_0;
  let R36_0 = this._R36_0;
  let R37_0 = this._R37_0;
  let R38_0 = this._R38_0;
  let R39_0 = this._R39_0;
  let R0_1 = this._R0_1;
  let R1_1 = this._R1_1;
  let R2_1 = this._R2_1;
  let R3_1 = this._R3_1;
  let R23_1 = this._R23_1;
  let R22_1 = this._R22_1;
  let R21_1 = this._R21_1;
  let R20_1 = this._R20_1;

  for (let i = 0; i < inNumSamples; i++) {
    const ftemp2 = inInL[i];
    const ftemp3 = inInR[i];
    const ftemp4 = (1.5e-02 * (ftemp2 + ftemp3));

    // left ch
    iota0 = ++iota0 % 225;
    iota1 = ++iota1 % 331;
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

    let T0 = dline0[iota0];
    let T1 = dline1[iota1];
    let T2 = dline2[iota2];
    let T3 = dline3[iota3];
    let T4 = dline4[iota4];
    let T5 = dline5[iota5];
    let T6 = dline6[iota6];
    let T7 = dline7[iota7];
    let T8 = dline8[iota8];
    let T9 = dline9[iota9];
    let T10 = dline10[iota10];
    let T11 = dline11[iota11];

    R5_0 = ((ftemp7 * R4_0) + (ftemp6 * R5_0));
    dline4[iota4] = (ftemp4 + (ftemp5 * R5_0));
    R4_0 = T4;

    R7_0 = ((ftemp7 * R6_0) + (ftemp6 * R7_0));
    dline5[iota5] = (ftemp4 + (ftemp5 * R7_0));
    R6_0 = T5;

    R9_0 = ((ftemp7 * R8_0) + (ftemp6 * R9_0));
    dline6[iota6] = (ftemp4 + (ftemp5 * R9_0));
    R8_0 = T6;

    R11_0 = ((ftemp7 * R10_0) + (ftemp6 * R11_0));
    dline7[iota7] = (ftemp4 + (ftemp5 * R11_0));
    R10_0 = T7;

    R13_0 = ((ftemp7 * R12_0) + (ftemp6 * R13_0));
    dline8[iota8] = (ftemp4 + (ftemp5 * R13_0));
    R12_0 = T8;

    R15_0 = ((ftemp7 * R14_0) + (ftemp6 * R15_0));
    dline9[iota9] = (ftemp4 + (ftemp5 * R15_0));
    R14_0 = T9;

    R17_0 = ((ftemp7 * R16_0) + (ftemp6 * R17_0));
    dline10[iota10] = (ftemp4 + (ftemp5 * R17_0));
    R16_0 = T10;

    R19_0 = ((ftemp7 * R18_0) + (ftemp6 * R19_0));
    dline11[iota11] = (ftemp4 + (ftemp5 * R19_0));
    R18_0 = T11;

    dline3[iota3] = ((((0.5 * R3_0) + R4_0) + (R6_0 + R8_0)) + ((R10_0 + R12_0) + (R14_0 +  (R16_0 + R18_0))));
    R3_0 = T3;

    R3_1 = (R3_0 - (((R4_0 + R6_0) + (R8_0 + R10_0)) + ((R12_0 + R14_0) +  (R16_0 + R18_0))));
    dline2[iota2] = ((0.5 * R2_0) + R3_1);
    R2_0 = T2;

    R2_1 = (R2_0 - R3_1);
    dline1[iota1] = ((0.5 * R1_0) + R2_1);
    R1_0 = T1;

    R1_1 = (R1_0 - R2_1);
    dline0[iota0] = ((0.5 * R0_0) + R1_1);
    R0_0 = T0;

    R0_1 = (R0_0 - R1_1);
    outL[i] = ((ftemp1 * ftemp2) + (ftemp0 * R0_1));

    // right ch
    iota12 = ++iota12 % 248;
    iota13 = ++iota13 % 364;
    iota14 = ++iota14 % 464;
    iota15 = ++iota15 % 579;
    iota16 = ++iota16 % 1640;
    iota17 = ++iota17 % 1580;
    iota18 = ++iota18 % 1514;
    iota19 = ++iota19 % 1445;
    iota20 = ++iota20 % 1300;
    iota21 = ++iota21 % 1139;
    iota22 = ++iota22 % 1211;
    iota23 = ++iota23 % 1379;

    let T12 = dline12[iota12];
    let T13 = dline13[iota13];
    let T14 = dline14[iota14];
    let T15 = dline15[iota15];
    let T16 = dline16[iota16];
    let T17 = dline17[iota17];
    let T18 = dline18[iota18];
    let T19 = dline19[iota19];
    let T20 = dline20[iota20];
    let T21 = dline21[iota21];
    let T22 = dline22[iota22];
    let T23 = dline23[iota23];

    R25_0 = ((ftemp7 * R24_0) + (ftemp6 * R25_0));
    dline16[iota16] = (ftemp4 + (ftemp5 * R25_0));
    R24_0 = T16;

    R27_0 = ((ftemp7 * R26_0) + (ftemp6 * R27_0));
    dline17[iota17] = (ftemp4 + (ftemp5 * R27_0));
    R26_0 = T17;

    R29_0 = ((ftemp7 * R28_0) + (ftemp6 * R29_0));
    dline18[iota18] = (ftemp4 + (ftemp5 * R29_0));
    R28_0 = T18;

    R31_0 = ((ftemp7 * R30_0) + (ftemp6 * R31_0));
    dline19[iota19] = (ftemp4 + (ftemp5 * R31_0));
    R30_0 = T19;

    R33_0 = ((ftemp7 * R32_0) + (ftemp6 * R33_0));
    dline20[iota20] = (ftemp4 + (ftemp5 * R33_0));
    R32_0 = T20;

    R35_0 = ((ftemp7 * R34_0) + (ftemp6 * R35_0));
    dline21[iota21] = (ftemp4 + (ftemp5 * R35_0));
    R34_0 = T21;

    R37_0 = ((ftemp7 * R36_0) + (ftemp6 * R37_0));
    dline22[iota22] = (ftemp4 + (ftemp5 * R37_0));
    R36_0 = T22;

    R39_0 = ((ftemp7 * R38_0) + (ftemp6 * R39_0));
    dline23[iota23] = (ftemp4 + (ftemp5 * R39_0));
    R38_0 = T23;

    dline15[iota15] = ((((0.5 * R23_0) + R24_0) + (R26_0 + R28_0)) + ((R30_0 + R32_0) + (R34_0 + (R36_0 + R38_0))));
    R23_0 = T15;

    R23_1 = (R23_0 - (((R24_0 + R26_0) + (R28_0 + R30_0)) + ((R32_0 + R34_0) + (R36_0 + R38_0))));
    dline14[iota14] = ((0.5 * R22_0) + R23_1);
    R22_0 = T14;

    R22_1 = (R22_0 - R23_1);
    dline13[iota13] = ((0.5 * R21_0) + R22_1);
    R21_0 = T13;

    R21_1 = (R21_0 - R22_1);
    dline12[iota12] = ((0.5 * R20_0) + R21_1);
    R20_0 = T12;

    R20_1 = (R20_0 - R21_1);
    outR[i] = ((ftemp1 * ftemp3) + (ftemp0 * R20_1));
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
  this._iota12 = iota12;
  this._iota13 = iota13;
  this._iota14 = iota14;
  this._iota15 = iota15;
  this._iota16 = iota16;
  this._iota17 = iota17;
  this._iota18 = iota18;
  this._iota19 = iota19;
  this._iota20 = iota20;
  this._iota21 = iota21;
  this._iota22 = iota22;
  this._iota23 = iota23;

  this._R0_1 = R0_1;
  this._R1_1 = R1_1;
  this._R2_1 = R2_1;
  this._R3_1 = R3_1;

  this._R20_1 = R20_1;
  this._R21_1 = R21_1;
  this._R22_1 = R22_1;
  this._R23_1 = R23_1;

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
  this._R20_0 = R20_0;
  this._R21_0 = R21_0;
  this._R22_0 = R22_0;
  this._R23_0 = R23_0;
  this._R24_0 = R24_0;
  this._R25_0 = R25_0;
  this._R26_0 = R26_0;
  this._R27_0 = R27_0;
  this._R28_0 = R28_0;
  this._R29_0 = R29_0;
  this._R30_0 = R30_0;
  this._R31_0 = R31_0;
  this._R32_0 = R32_0;
  this._R33_0 = R33_0;
  this._R34_0 = R34_0;
  this._R35_0 = R35_0;
  this._R36_0 = R36_0;
  this._R37_0 = R37_0;
  this._R38_0 = R38_0;
  this._R39_0 = R39_0;
};

SCUnitRepository.registerSCUnitClass("FreeVerb2", SCUnitFreeVerb2);

module.exports = SCUnitFreeVerb2;
