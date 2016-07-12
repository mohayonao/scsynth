"use strict";

const C = require("./Constants");
const SCUnitRepository = require("./SCUnitRepository");

const CONSTANT_VALUE = -1;
const BYTES_PER_ELEMENT = Float32Array.BYTES_PER_ELEMENT;

class SCSynthBuilder {
  static build(synthInstance, synthdef) {
    const context = synthInstance.context;
    const consts = synthdef.consts.map(x => new Float32Array([ x ]));
    const params = new Float32Array(synthdef.paramValues);
    const bufferLength = synthdef.units.reduce((sum, unitSpec) => {
      return sum + unitSpec[4].reduce((sum, rate) => {
        return sum + $rate(context, rate).bufferLength;
      }, 0);
    }, 0);
    const buffer = new Float32Array(bufferLength);
    const unitList = [];
    const dspUnitList = [];

    synthInstance.consts = consts;
    synthInstance.params = params;
    synthInstance.buffer = buffer;
    synthInstance.unitList = unitList;
    synthInstance.dspUnitList = dspUnitList;

    const unitSpecs = synthdef.units;

    let bufferOffset = 0;

    for (let i = 0, imax = unitSpecs.length; i < imax; i++) {
      const unitSpec = unitSpecs[i];
      const inputSpecs = unitSpec[3];
      const outputSpecs = unitSpec[4];
      const unit = SCUnitRepository.createSCUnit(synthInstance, unitSpec);

      for (let j = 0, jmax = unit.inputs.length; j < jmax; j++) {
        const inputSpec = inputSpecs[j];

        if (inputSpec[0] === CONSTANT_VALUE) {
          unit.inputs[j] = consts[inputSpec[1]];
          unit.inputSpecs[j].rate = C.RATE_SCALAR;
        } else {
          unit.inputs[j] = unitList[inputSpec[0]].outputs[inputSpec[1]];
          unit.inputSpecs[j].rate = unitList[inputSpec[0]].outputSpecs[inputSpec[1]].rate;
          unit.inputSpecs[j].unit = unitList[inputSpec[0]];
        }
      }
      for (let j = 0, jmax = unit.outputs.length; j < jmax; j++) {
        const outputSpec = outputSpecs[j];
        const bufferLength = $rate(context, outputSpec).bufferLength;

        unit.outputs[j] = new Float32Array(buffer.buffer, bufferOffset * BYTES_PER_ELEMENT, bufferLength);
        unit.outputSpecs[j].rate = outputSpec;

        bufferOffset += bufferLength;
      }

      const rate = $rate(context, unit.calcRate);

      unit.bufferLength = rate.bufferLength;
      unit.initialize(rate);

      unitList[i] = unit;

      if (unit.dspProcess && unit.calcRate !== C.RATE_DEMAND) {
        dspUnitList.push(unit);
      }
    }

    return synthInstance;
  }
}

function $rate(context, rate) {
  return rate === C.RATE_AUDIO ? context.aRate : context.kRate;
}

module.exports = SCSynthBuilder;
