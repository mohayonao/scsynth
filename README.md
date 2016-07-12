# scsynth
[![Build Status](http://img.shields.io/travis/mohayonao/scsynth.svg?style=flat-square)](https://travis-ci.org/mohayonao/scsynth)
[![NPM Version](http://img.shields.io/npm/v/scsynth.svg?style=flat-square)](https://www.npmjs.org/package/scsynth)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> sound processing like SuperCollider in JavaScript

:construction_worker: :zzz:

## Installation

```
npm install --save scsynth
```

## Example

```js
const scsynth = require("scsynth");

const context = new scsynth.SCContext();
const synth = context.createSynth({
  name: "sine",
  consts: [ 0 ],
  paramValues: [ 0.5, 440 ],
  paramIndices: { amp: { index: 0, length: 1 }, freq: { index: 1, length: 1 } },
  units: [
    [ "Control"     , 1, 0, [                                ], [ 1, 1 ] ],
    [ "SinOsc"      , 2, 0, [ [  0, 1 ], [ -1, 0 ]           ], [ 2    ] ],
    [ "BinaryOpUGen", 2, 2, [ [  1, 0 ], [  0, 0 ]           ], [ 2    ] ],
    [ "Out"         , 2, 0, [ [ -1, 0 ], [  2, 0 ], [ 2, 0 ] ], [      ] ]
  ]
});

context.addToTail(synth);

for (let i = 0; i < 256; i++) {
  synth.$freq = 440 * Math.pow(2, i / 256);
  synth.$amp = 1 - (i / 256);
  synth.process();

  console.log("L:", context.outputs[0]);
  console.log("R:", context.outputs[1]);
}
```

## See Also

- [synthdef-decoder](https://github.com/mohayonao/synthdef-decoder)
  - decode SuperCollider Synth Definition File Format and convert to JSON

## License

MIT
