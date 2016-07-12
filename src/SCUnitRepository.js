"use strict";

const db = new Map();

class SCUnitRepository {
  static createSCUnit(synth, unitSpec) {
    const name = unitSpec[0];

    if (!db.has(name)) {
      throw new TypeError(`SCUnit not defined: ${ name }`);
    }

    return new (db.get(name))(synth, unitSpec);
  }

  static registerSCUnitClass(name, SCUnitClass) {
    return db.set(name, SCUnitClass);
  }

  static unregisterSCUnitClass(name) {
    return db.delete(name);
  }
}

module.exports = SCUnitRepository;
