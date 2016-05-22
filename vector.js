'use strict';

module.exports = integrate;

// This algorithm adapted from pseudocode in:
// http://www.math.utk.edu/~ccollins/refs/Handouts/rich.pdf
function adsimp (out, f, a, b, n, fa, fm, fb, V0, tol, maxdepth, depth, state) {
  var i;
  if (state.nanEncountered) {
    return NaN;
  }

  var h, f1, f2, sl, sr, m, V1, V2, l2err;

  sl = new Array(n);
  sr = new Array(n);

  h = b - a;
  f1 = new Array(n);
  f2 = new Array(n);

  f(f1, a + h * 0.25);
  f(f2, b - h * 0.25);

  l2err = 0;
  for (i = 0; i < n; i++) {
    // Simple check for NaN:
    if (isNaN(f1[i])) {
      state.nanEncountered = true;
      return;
    }

    // Simple check for NaN:
    if (isNaN(f2[i])) {
      state.nanEncountered = true;
      return;
    }

    sl[i] = h * (fa[i] + 4 * f1[i] + fm[i]) / 12;
    sr[i] = h * (fm[i] + 4 * f2[i] + fb[i]) / 12;
    state.s2[i] = sl[i] + sr[i];
    state.err[i] = Math.pow((state.s2[i] - V0[i]) / 15, 2);
    l2err += state.err[i];
  }

  l2err = Math.sqrt(l2err);

  if (depth > maxdepth) {
    state.maxDepthCount++;
    for (i = 0; i < n; i++) {
      out[i] = state.s2[i] + state.err[i];
    }
  } else if (l2err < tol) {
    for (i = 0; i < n; i++) {
      out[i] = state.s2[i] + state.err[i];
    }
  } else {
    m = a + h * 0.5;

    V1 = new Array(n);
    adsimp(V1, f, a, m, n, fa, f1, fm, sl, tol * 0.5, maxdepth, depth + 1, state);

    for (i = 0; i < n; i++) {
      if (isNaN(V1[i])) {
        state.nanEncountered = true;
        return NaN;
      }
    }

    V2 = new Array(n);
    adsimp(V2, f, m, b, n, fm, f2, fb, sr, tol * 0.5, maxdepth, depth + 1, state);

    for (i = 0; i < n; i++) {
      if (isNaN(V2[i])) {
        state.nanEncountered = true;
        return NaN;
      }
    }

    for (i = 0; i < n; i++) {
      out[i] = V1[i] + V2[i];
    }
  }
}

function integrate (f, a, b, tol, maxdepth) {
  var i, n, result;

  var state = {
    maxDepthCount: 0,
    nanEncountered: false
  };

  if (tol === undefined) {
    tol = 1e-8;
  }
  if (maxdepth === undefined) {
    maxdepth = 20;
  }

  var fa = [];
  var fm = [];
  var fb = [];

  f(fa, a);
  f(fm, 0.5 * (a + b));
  f(fb, b);

  // Get the dimensionality based on function evaluation:
  n = fa.length;

  // Avoid a bit of garbage collection. Could do way better, but this
  // is a start...
  state.err = [];
  state.s2 = [];

  var V0 = [];
  for (i = 0; i < n; i++) {
    V0[i] = (fa[i] + 4 * fm[i] + fb[i]) * (b - a) / 6;
  }

  result = [];
  for (i = 0; i < n; i++) {
    result[i] = 0;
  }

  adsimp(result, f, a, b, n, fa, fm, fb, V0, tol, maxdepth, 1, state);

  if (state.maxDepthCount > 0 && console && console.warn) {
    console.warn('integrate-adaptive-simpson: Warning: maximum recursion depth (' + maxdepth + ') reached ' + state.maxDepthCount + ' times');
  }

  if (state.nanEncountered && console && console.warn) {
    console.warn('integrate-adaptive-simpson: Warning: NaN encountered. Halting early.');
  }

  return result;
}
