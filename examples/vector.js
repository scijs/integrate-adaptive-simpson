'use strict';

var integrate = require('../vector');

var res = integrate(function (f, theta) {
  var c = Math.cos(theta);
  var s = Math.sin(theta);

  var dzr = -s;
  var dzi = c;

  var fr = c / (c * c + s * s);
  var fi = -s / (c * c + s * s);

  f[0] = fr * dzr - fi * dzi;
  f[1] = fr * dzi + fi * dzr;
}, 0, Math.PI * 2);

console.log('integral 1 / z about 0 =', res);

