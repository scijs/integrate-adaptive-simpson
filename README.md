# integrate-adaptive-simpson [![Build Status](https://travis-ci.org/scijs/integrate-adaptive-simpson.svg)](https://travis-ci.org/scijs/integrate-adaptive-simpson) [![npm version](https://badge.fury.io/js/integrate-adaptive-simpson.svg)](http://badge.fury.io/js/integrate-adaptive-simpson) [![Dependency Status](https://david-dm.org/scijs/integrate-adaptive-simpson.svg)](https://david-dm.org/scijs/integrate-adaptive-simpson)

> Compute a definite integral of one variable using [Simpson's Rule](https://en.wikipedia.org/wiki/Simpson%27s_rule) with adaptive quadrature


## Introduction

This module computes the definite integral <p align="center"><img alt="&bsol;int&lowbar;a&Hat;b f&lpar;x&rpar; &bsol;&comma; dx" valign="middle" src="images/int_ab-fx-dx-49d001614b.png" width="99.5" height="56.5"></p> using [Romberg Integration](https://en.wikipedia.org/wiki/Romberg%27s_method) based on [Simpson's Rule](https://en.wikipedia.org/wiki/Simpson%27s_rule). That is, it uses [Richardson Extrapolation](https://en.wikipedia.org/wiki/Richardson_extrapolation) to estimate the error and recursively subdivide intervals until the error tolerance is met. The code is adapted from the pseudocode in [Romberg Integration and Adaptive Quadrature](http://www.math.utk.edu/~ccollins/refs/Handouts/rich.pdf).

## Install

```bash
$ npm install integrate-adaptive-simpson
```

## Example

Other quadrature methods may competitive or superior, but compared with something like [regular Simpson's Rule Ingration](https://github.com/scijs/integrate-simpson), this module is reasonably efficient and robust in the presence of difficulties like oscillatory functions. Consider the definite integral <p align="center"><img alt="&bsol;int&lowbar;&lcub;0&period;01&rcub;&Hat;&lcub;1&rcub; &bsol;frac&lcub;1&rcub;&lcub;x&rcub;&bsol;cos&bsol;left&lpar;&bsol;frac&lcub;1&rcub;&lcub;x&rcub;&bsol;right&rpar;&bsol;&comma;dx&period;" valign="middle" src="images/int_0011-frac1xcosleftfrac1xrightdx-8ba7ad4f6c.png" width="177" height="56.5"></p>

This function oscillates and diverges near the origin:

<p align="center"><img width="500" height="368" alt="1/x * cos(1/x) on a linear scale" src="docs/images/oscillatory-linlin.png"></div>

On a log-linear scale, this looks like:

<p align="center"><img width="500" height="368" alt="1/x * cos(1/x) on a log-linear scale" src="docs/images/oscillatory-loglin.png"></div>

Achieving an absolute error on the order of <img alt="1 &bsol;cdot 10&Hat;&lcub;-8&rcub;" valign="middle" src="images/1-cdot-10-8-1afd7b757c.png" width="70" height="28"> with regular Simpson's Rule integration:

```javascript
function f(x) { return Math.cos(1/x)/x }

require('integrate-simpson')( f, 0.01, 1, 29118 )
```
requires (determined by trial and error to match the error of the adaptive method) about 29118 function evaluations. The same integral computed with adaptive integration:

```javascript
require('integrate-adaptive-simpson')( f, 0.01, 1, 3.1e-6 )
```

requires 2077 function evaluations, a savings of 93%!


Computation of a more modest integral like <img alt="&bsol;int&lowbar;0&Hat;&bsol;pi &bsol;sin&lpar;x&rpar;&bsol;&comma;dx" valign="middle" src="images/int_0pi-sinxdx-b77ad0db6d.png" width="108" height="35"> may still save about a factor of two on function evaluations (17 for adaptive vs. 45 for regular Simpson's Rule to acheive an absolute error of <img alt="1 &bsol;cdot 10&Hat;&lcub;-8&rcub;" valign="middle" src="images/1-cdot-10-8-1afd7b757c.png" width="70" height="28">). See [examples/comparison.js](examples/comparison.js) for a comparison. Of course the benefit is not needing to tell the algorithm in advance that it may be an expensive function to integrate, making it a not-unreasonable black-box integrator.

## API

#### `require('integrate-adaptive-simpson')( f, a, b [, tol, maxdepth]] )`
**Arguments:**
- `f`: The function to be integrated. A function of one variable that returns a value.
- `a`: The lower limit of integration, <img alt="a" valign="middle" src="images/a-2217a6870d.png" width="15" height="28">.
- `b`: The upper limit of integration, <img alt="b" valign="middle" src="images/b-224c764dec.png" width="13" height="28">.
- `tol`: The relative error required for an interval to be subdivided, based on Richardson extraplation. Default tolerance is `1e-8`. Be careful—the total accumulated error may be significantly less and result in more function evaluations than necessary.
- `maxdepth`: The maximum recursion depth. Default depth is `20`. If reached, computation continues and a warning is output to the console.

**Returns**: The computed value of the definite integral.

## References
Colins, C., [Romberg Integration and Adaptive Quadrature Course Notes](http://www.math.utk.edu/~ccollins/refs/Handouts/rich.pdf).

## License

(c) 2015 Scijs Authors. MIT License.