'use strict';

var romberg = require('../lib');
var simpson = require('integrate-simpson');
var value, evaluations;

function f (x) {
  evaluations++;
  return Math.cos(1 / x) / x;
}

// Calculated via wolfram alpha, using a roundabout way of getting a few extra digits of (hopeful) precision:
// http://www.wolframalpha.com/input/?i=%28integral+of+%28cos%281%2Fx%29%2Fx%29+from+x%3D0.01+to+x%3D1%29+%2B+0.342553+-+2.51956e-7
var actual = -0.34255274804359265;

evaluations = 0;
value = simpson(f, 0.01, 1, 29118);
console.log('\nSimpson integration (' + evaluations + ' evaluations):');
console.log('Absolute error:', Math.abs(value - actual));

// Adaptive integration requires about half the number of evaluations
// acheive the same absolute error:
evaluations = 0;
value = romberg(f, 0.01, 1, 3.1e-6);
console.log('\nAdaptive Simpson integration (' + evaluations + ' evaluations):');
console.log('Absolute error:', Math.abs(value - actual));
