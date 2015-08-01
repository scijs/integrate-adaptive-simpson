# integrate-adaptive-simpson [![Build Status](https://travis-ci.org/scijs/integrate-adaptive-simpson.svg)](https://travis-ci.org/scijs/integrate-adaptive-simpson) [![npm version](https://badge.fury.io/js/integrate-adaptive-simpson.svg)](http://badge.fury.io/js/integrate-adaptive-simpson) [![Dependency Status](https://david-dm.org/scijs/integrate-adaptive-simpson.svg)](https://david-dm.org/scijs/integrate-adaptive-simpson)

> Compute a definite integral of one variable using [Simpson's Rule](https://en.wikipedia.org/wiki/Simpson%27s_rule) with adaptive quadrature


## Introduction

This module computes the definite integral <p align="center"><img alt="undefined" valign="middle" src="docs/images/int_ab-fx-dx-a1ac3b24ed.png" width="99.5" height="54.5"></p> using [Romberg Integration](https://en.wikipedia.org/wiki/Romberg%27s_method) based on [Simpson's Rule](https://en.wikipedia.org/wiki/Simpson%27s_rule). It uses [Richardson Extrapolation](https://en.wikipedia.org/wiki/Richardson_extrapolation) to estimate the error and recursively subdivide intervals until the error tolerance is met. The code is adapted (with gratitude and little modification!) from the pseudocode in [Romberg Integration and Adaptive Quadrature](http://www.math.utk.edu/~ccollins/refs/Handouts/rich.pdf).

## Install

```bash
$ npm install integrate-adaptive-simpson
```

## Example

Other quadrature-based methods may competitive or superior, but compared with fixed quadrature, this module is reasonably efficient and robust in the presence of difficulties like oscillatory functions. Consider the definite integral <p align="center"><img alt="undefined" valign="middle" src="docs/images/int_0011-frac1xcosleftfrac1xrightdx-d7e8731b7d.png" width="177" height="54.5"></p>

This function oscillates and diverges near the origin:

<p align="center"><img width="500" height="368" alt="1/x * cos(1/x) on a linear scale" src="docs/images/oscillatory-linlin.png"></div>

On a log-linear scale, this looks like:

<p align="center"><img width="500" height="368" alt="1/x * cos(1/x) on a log-linear scale" src="docs/images/oscillatory-loglin.png"></div>

Achieving an absolute error on the order of <img alt="undefined" valign="middle" src="docs/images/1-cdot-10-8-09bd84e939.png" width="70" height="20.5"> with regular Simpson's Rule integration:

```javascript
function f(x) { return Math.cos(1/x)/x }

require('integrate-simpson')( f, 0.01, 1, 29118 )
```
requires (determined by trial and error to match the error of the adaptive method) about 29118 function evaluations. The same integral computed with adaptive integration:

```javascript
require('integrate-adaptive-simpson')( f, 0.01, 1, 3.1e-6 )
```

requires 2077 function evaluations, a savings of 93%!


Computation of a more modest integral like <img alt="undefined" valign="middle" src="docs/images/int_02-sinxdx-e474f19aa8.png" width="106" height="31.5"> may still save about a factor of two on function evaluations (17 for adaptive vs. 45 for regular Simpson's Rule to acheive an absolute error of <img alt="undefined" valign="middle" src="docs/images/1-cdot-10-8-09bd84e939.png" width="70" height="20.5">). See [examples/comparison.js](examples/comparison.js) for a comparison.

## API

#### `require('integrate-adaptive-simpson')( f, a, b [, tol [, maxdepth]] )`
**Arguments:**
- `f`: The function to be integrated. A function of one variable that returns a value.
- `a`: The lower limit of integration, <img alt="undefined" valign="middle" src="docs/images/a-a1c2708a7a.png" width="15" height="13">.
- `b`: The upper limit of integration, <img alt="undefined" valign="middle" src="docs/images/b-5891343d52.png" width="13" height="18">.
- `tol`: The relative error required for an interval to be subdivided, based on Richardson extraplation. Be careful—the total accumulated error may be significantly less and result in more function evaluations than necessary.
- `maxdepth`: The maximum recursion depth. If reached, computation continues and a warning is output to the console.

**Returns**: The computed value of the definite integral.

## Credits

(c) 2015 Ricky Reusser. MIT License