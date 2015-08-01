'use strict'

var adsimp = require('../lib')
  , simpson = require('integrate-simpson')
  , evaluations

function f(x) {
  evaluations++
  return Math.sin(x)
}


evaluations = 0
var value = simpson( f, 0, Math.PI, 22 )
console.log('\nSimpson integration (' + evaluations + ' evaluations):')
console.log('Absolute error:',Math.abs(value-2))

// Adaptive integration requires about half the number of evaluations
// acheive the same absolute error:
evaluations = 0
var value = adsimp( f, 0, Math.PI, 1e-4 )
console.log('\nAdaptive Simpson integration (' + evaluations + ' evaluations):')
console.log('Absolute error:',Math.abs(value-2))


// Adaptive integration with default tolerance:
evaluations = 0
var value = adsimp( f, 0, Math.PI )
console.log('\nAdaptive simpson integration with defaults(' + evaluations + ' evaluations):')
console.log('Absolute error:',Math.abs(value-2))
