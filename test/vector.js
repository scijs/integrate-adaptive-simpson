/* globals it, describe */
'use strict';

var integrate = require('../vector');
var assert = require('chai').assert;
var arrayEqual = require('./util/array-equal');
var contourIntegrand = require('./util/contour-integrand');

describe('Vector adaptive Simpson integration', function () {
  it('integrates f(z) = 1 + i around the unit complex circle', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      return [1, 1];
    }), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });

  it('integrates f(z) = z around the unit complex circle', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      return [a, b];
    }), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });

  it('integrates f(z) = z^2 around the unit complex circle', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      return [a * a - b * b, 2 * a * b];
    }), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });

  it('integrates f(z) = z^2 around the unit complex circle', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      return [a * a - b * b, 2 * a * b];
    }), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });

  it('computes Res 1 / z about z0 = 0', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      var denom = a * a + b * b;
      return [a / denom, -b / denom];
    }), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, Math.PI * 2]));
  });

  it('computes Res 1 / z about z0 = 10 + 10i', function () {
    var result = integrate(contourIntegrand(function (f, a, b) {
      var denom = a * a + b * b;
      f[0] = a / denom;
      f[1] = -b / denom;
    }, 2, 2, 1), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });

  it('computes Res 1 / (z - 10 + 10i) about z0 = 0', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      var denom = a * a + b * b;
      return [a / denom, -b / denom];
    }, 10, -10, 1), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });

  it('computes Res 1 / (z - 10 + 10i) about z0 = 10 - 10i', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      var a0 = a - 10;
      var b0 = b + 10;
      var denom = a0 * a0 + b0 * b0;
      return [a0 / denom, -b0 / denom];
    }, 10, -10, 1), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, Math.PI * 2]));
  });

  it('computes Res 1 / (z - 10 + 10i) about z0 = 10 - 10i (radius = 2)', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      var a0 = a - 10;
      var b0 = b + 10;
      var denom = a0 * a0 + b0 * b0;
      return [a0 / denom, -b0 / denom];
    }, 10, -10, 2), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, Math.PI * 2]));
  });

  it('computes Res 1 / z^2 about z0 = 0', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      var denom = Math.pow(a * a + b * b, 2);
      return [
        (a * a - b * b) / denom,
        -2 * a * b / denom
      ];
    }), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });

  it('computes Res 1 / z^3 about z0 = 0', function () {
    var result = integrate(contourIntegrand(function (a, b) {
      var denom = Math.pow(a * a + b * b, 3);
      return [
        (a * a * a - 3 * a * b * b) / denom,
        (b * b * b - 3 * a * a * b) / denom
      ];
    }), 0, Math.PI * 2);

    assert(arrayEqual(result, [0, 0]));
  });
});
