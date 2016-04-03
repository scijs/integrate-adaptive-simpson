//
// In order to run this example, you'll need to run:
// $ npm install mathjs
//

var mathjs = require('mathjs');
var integrate = require('../');
var parser = mathjs.parser();

parser.eval('f(x) = cos(1/x)/x');
var value = integrate(parser.get('f'), 0.01, 1, 0.001);

console.log('integral of cos(1/x)/x from 0.01 to 1:');
console.log('expected approimxate value: -0.342553');
console.log('value = ', value);
