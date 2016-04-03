'use strict';

var Benchmark = require('scijs-benchmark');
var integrateVersion105 = require('integrate-adaptive-simpson');
var integrateCurrent = require('../');
var table = require('table').default;

var bench = new Benchmark({
  maxDuration: 1000,
  maxSamples: 1000,
  getTime: process.hrtime,
  getTimeDiff: function (t1, t2) {
    return (t2[0] - t1[0]) * 1e3 + (t2[1] - t1[1]) * 1e-6
  }
})

function f (x) {
  return Math.cos(1 / x) / x;
}

bench
  .measure('version 1.0.5', function () {
    integrateVersion105(f, 0.01, 1, 1e-10, 22);
  })

  .measure('current version', function () {
    integrateCurrent(f, 0.01, 1, 1e-10, 22);
  })

  .run(function (err, results) {
    console.log(table(bench.toTable()));
  });

