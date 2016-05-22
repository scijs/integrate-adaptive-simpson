'use strict';

var almostEqual = require('almost-equal');

module.exports = arrayEqual;

function arrayEqual (computed, expected, t1, t2) {
  t1 = t1 === undefined ? almostEqual.FLT_EPSILON : t1;
  t2 = t2 === undefined ? almostEqual.FLT_EPSILON : t2;

  if (computed.length !== expected.length) {
    throw new Error('Length of computed (' + computed.length + ') not equal to length of expected (' + expected.length + ')');
  }

  for (var i = 0; i < computed.length; i++) {
    if (!almostEqual(computed[i], expected[i], t1, t2)) {
      throw new Error('Arrays not equal. computed[' + i + '] !~ expected[' + i + '] (' + computed[i] + ' !~ ' + expected[i] + ')');
    }
  }

  return true;
}
