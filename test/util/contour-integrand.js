'use strict';

module.exports = contourIntegrand;

function contourIntegrand (f, z0r, z0i, r) {
  // Defaults:
  r = r === undefined ? 1 : r;
  z0r = z0r === undefined ? 0 : z0r;
  z0i = z0i === undefined ? 0 : z0i;

  if (f.length === 2) {
    return function (out, theta) {
      // Compute the unit circle:
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      var dzr = -r * s;
      var dzi = r * c;
      var a = z0r + r * c;
      var b = z0i + r * s;

      // Evaluate the function:
      var y = f(a, b);

      // Compute the integrand:
      out[0] = y[0] * dzr - y[1] * dzi;
      out[1] = y[0] * dzi + y[1] * dzr;
    };
  } else if (f.length === 3) {
    // Avoid allocating storage over and over:
    var y = [];

    return function (out, theta) {
      // Compute the unit circle:
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      var dzr = -r * s;
      var dzi = r * c;
      var a = z0r + r * c;
      var b = z0i + r * s;

      // Evaluate the function:
      f(y, a, b);

      // Compute the integrand:
      out[0] = y[0] * dzr - y[1] * dzi;
      out[1] = y[0] * dzi + y[1] * dzr;
    };
  } else {
    throw new Error('f must be a function accepting either two or three arguments');
  }
}
