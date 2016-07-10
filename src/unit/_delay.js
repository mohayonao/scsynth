"use strict";

const log001 = Math.log(0.001);

function feedback(delaytime, decaytime) {
  if (delaytime === 0 || decaytime === 0) {
    return 0;
  }
  if (decaytime > 0) {
    return +Math.exp(log001 * delaytime / +decaytime);
  } else {
    return -Math.exp(log001 * delaytime / -decaytime);
  }
}

module.exports = { feedback };
