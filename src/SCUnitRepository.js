"use strict";

const db = {};

class SCUnitRepository {
  static createSCUnit(synth, unitSpec) {
    const name = unitSpec[0];

    if (!db.hasOwnProperty(name)) {
      throw new TypeError(`SCUnit is not defined: ${ name }`);
    }

    return new (db[name])(synth, unitSpec);
  }

  static registerSCUnitClass(name, SCUnitClass) {
    db[name] = SCUnitClass;
  }

  static unregisterSCUnitClass(name) {
    delete db[name];
  }
}

module.exports = SCUnitRepository;
