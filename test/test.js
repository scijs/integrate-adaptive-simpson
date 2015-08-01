'use strict'

var adaptiveSimpson = require('../lib')
  , assert = require('chai').assert
  , richardson = require('richardson-extrapolation')
  , simpson = require('integrate-simpson')

describe("Adaptive Simpson integration", function() {

  it("integrates a constant exactly",function() {
    var evaluations = 0
    var value = adaptiveSimpson( function() {
      evaluations++
      return 2
    }, 1, 3)

    assert.closeTo( value, 4, 0, '= 4')

    // Five evaluations means exact evaluation + error estimate = 0:
    assert.equal(evaluations,5,'evaluates the function five times')
  })

  it("integrates a cubic exactly",function() {
    var evaluations = 0
    var value = adaptiveSimpson( function(x) {
      evaluations++
      return x*x*x - x*x
    }, 1, 3)

    assert.closeTo( value, 34/3, 1e-10, '= 34/3')

    // Five evaluations means exact evaluation + error estimate = 0:
    assert.equal(evaluations,5,'evaluates the function five times')
  })

  it("integrates an irrational function",function() {
    var evaluations = 0
    var f = function(x) {
      evaluations++
      return Math.sin(x)
    }
    var value = adaptiveSimpson( f, 0, Math.PI)
    console.log('Evaluated f(x) '+evaluations+' times')
    assert.closeTo( value, 2, 1e-10, '= 2')
  })

  it("integrates an oscillatory function",function() {
    // See: http://www.wolframalpha.com/input/?i=integrate+cos%281%2Fx%29%2Fx+from+x%3D0.01+to+x%3D1
    var evaluations = 0
    var f = function(x) {
      evaluations++
      return Math.cos(1/x)/x
    }

    // Selected this tolerance with trial and error to minimize evaluations:
    var v1 = adaptiveSimpson( f, 0.01, 1, 6e-4, 20)
    console.log('Evaluated f(x) '+evaluations+' times')
    assert.closeTo( v1, -0.342553, 1e-5, '= 2')
  })

})
