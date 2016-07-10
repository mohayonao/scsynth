"use strict";

const kSineSize = 8192;
const kSineMask = kSineSize - 1;
const kBadValue = new Float32Array([ 1e20 ])[0];
const gSine = new Float32Array(kSineSize + 1);
const gInvSine = new Float32Array(kSineSize + 1);
const gSineWavetable = new Float32Array(kSineSize * 2);

function makeSine() {
  for (let i = 0; i < kSineSize; i++) {
    const d = Math.sin((i / kSineSize) * 2 * Math.PI);

    gSine[i] = d;
    gInvSine[i] = 1 / d;
  }
  gSine[kSineSize] = gSine[0];
  gInvSine[0] = gInvSine[kSineSize >> 1] = gInvSine[kSineSize] = kBadValue;

  const sz1 = kSineSize;
  const sz2 = sz1 >> 1;

  for (let i = 1; i <= 8; i++) {
    gInvSine[i] = gInvSine[sz1 - i] = gInvSine[sz2 - i] = gInvSine[sz2 + i] = kBadValue;
  }
}

function makeSineWaveTable() {
  let val1, val2;
  let j = 0;

  for (let i = 0; i < kSineSize - 1; i++) {
    val1 = gSine[i];
    val2 = gSine[i + 1];
    gSineWavetable[j++] = 2 * val1 - val2;
    gSineWavetable[j++] = val2 - val1;
  }

  val1 = gSine[kSineSize - 1];
  val2 = gSine[0];
  gSineWavetable[j++] = 2 * val1 - val2;
  gSineWavetable[j++] = val2 - val1;
}

makeSine();
makeSineWaveTable();

module.exports = { kSineSize, kSineMask, kBadValue, gSine, gInvSine, gSineWavetable };
