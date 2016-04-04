/* globals it, describe */
'use strict';

var adaptiveSimpson = require('../');
var assert = require('chai').assert;
var sinon = require('sinon');
// var simpson = require('integrate-simpson');

describe('Adaptive Simpson integration', function () {
  it('integrates a constant exactly', function () {
    var evaluations = 0;
    var value = adaptiveSimpson(function () {
      evaluations++;
      return 2;
    }, 1, 3);

    assert.closeTo(value, 4, 0, '= 4');

    // Five evaluations means exact evaluation + error estimate = 0:
    assert.equal(evaluations, 5, 'evaluates the function five times');
  });

  it('integrates a cubic exactly', function () {
    var evaluations = 0;
    var value = adaptiveSimpson(function (x) {
      evaluations++;
      return x * x * x - x * x;
    }, 1, 3);

    assert.closeTo(value, 34 / 3, 1e-10, '= 34/3');

    // Five evaluations means exact evaluation + error estimate = 0:
    assert.equal(evaluations, 5, 'evaluates the function five times');
  });

  it('integrates an irrational function', function () {
    var evaluations = 0;
    var f = function (x) {
      evaluations++;
      return Math.sin(x);
    };
    var value = adaptiveSimpson(f, 0, Math.PI);
    assert.closeTo(value, 2, 1e-10, '= 2');
  });

  it('stops immediately when NaN encountered', function () {
    var nanEvaluations = 0;
    var f = function (x) {
      if (x > 0.2 && x < 0.3) {
        nanEvaluations++;
        return NaN;
      }
      return Math.sin(x);
    };
    var value = adaptiveSimpson(f, 0, Math.PI);
    assert.equal(nanEvaluations, 1);
    assert.isNaN(value);
  });

  it('stops quickly when infinity encountered', function () {
    // Inifnity carries through to NaN pretty quickly, so we'll avoid a separate
    // check, but it will bail pretty quickly:
    var infinityEvaluations = 0;
    var f = function (x) {
      if (x > 0.2 && x < 0.3) {
        infinityEvaluations++;
        return Infinity;
      }
      return Math.sin(x);
    };
    var value = adaptiveSimpson(f, 0, Math.PI, 1e-10, 5);

    // This would be like 100000 if not caught:
    assert(infinityEvaluations < 10);
    assert.isNaN(value);
  });

  it('integrates an oscillatory function', function () {
    // See: http://www.wolframalpha.com/input/?i=integrate+cos%281%2Fx%29%2Fx+from+x%3D0.01+to+x%3D1
    var evaluations = 0;
    var f = function (x) {
      evaluations++;
      return Math.cos(1 / x) / x;
    };

    // Selected this tolerance with trial and error to minimize evaluations:
    var v1 = adaptiveSimpson(f, 0.01, 1, 6e-4, 20);
    assert.closeTo(v1, -0.342553, 1e-5, '= 2');
  });

  it('integrates 3 * x + 10 from 0 to 10', function () {
    var g = function (x) {
      return 3 * x + 10;
    };
    var value = adaptiveSimpson(g, 0, 10, 1);
    assert.closeTo(value, 250, 1e-5, '= 250');

    value = adaptiveSimpson(g, 0, 10, 0.9);
    assert.closeTo(value, 250, 1e-5, '= 250');
  });

  it('Prints one console warn when tolerance exceeded', function () {
    var _origWarn = console.warn;
    console.warn = sinon.spy(_origWarn);

    var f = function (x) {
      return Math.cos(1 / x) / x;
    };

    // Selected this tolerance with trial and error to minimize evaluations:
    var v1 = adaptiveSimpson(f, 0.01, 1, 0, 15);
    assert.closeTo(v1, -0.342553, 1e-3, '= 2');
    assert.equal(console.warn.callCount, 1, 'console.warn called once');

    console.warn = _origWarn;
  });
});
