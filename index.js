'use strict';

module.exports = Integrator;

// This algorithm adapted from pseudocode in:
// http://www.math.utk.edu/~ccollins/refs/Handouts/rich.pdf
function adsimp (f, a, b, fa, fm, fb, V0, tol, maxdepth, depth, state) {
  var h, f1, f2, sl, sr, s2, m, V1, V2, err;

  h = b - a;
  f1 = f(a + h * 0.25);
  f2 = f(b - h * 0.25);
  sl = h * (fa + 4 * f1 + fm) / 12;
  sr = h * (fm + 4 * f2 + fb) / 12;
  s2 = sl + sr;
  err = (s2 - V0) / 15;

  if (depth > maxdepth) {
    if (!state.warned && console.warn) {
      console.warn('integrate-adaptive-simpson: Warning: maximum recursion depth (' + maxdepth + ') exceeded');
      state.warned = true;
    }
    return s2 + err;
  } else if (Math.abs(err) < tol) {
    return s2 + err;
  } else {
    m = a + h * 0.5;
    V1 = adsimp(f, a, m, fa, f1, fm, sl, tol * 0.5, maxdepth, depth + 1, state);
    V2 = adsimp(f, m, b, fm, f2, fb, sr, tol * 0.5, maxdepth, depth + 1, state);
    return V1 + V2;
  }
}

function Integrator (f, a, b, tol, maxdepth) {
  var state = {
    warned: false
  };

  if (tol === undefined) {
    tol = 1e-8;
  }
  if (maxdepth === undefined) {
    maxdepth = 20;
  }

  var fa = f(a);
  var fm = f(0.5 * (a + b));
  var fb = f(b);

  var V0 = (fa + 4 * fm + fb) * (b - a) / 6;

  return adsimp(f, a, b, fa, fm, fb, V0, tol, maxdepth, 1, state);
}
