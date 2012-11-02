var ffi = require('node-ffi');

var libm = ffi.Library('libm', {
	  'ceil': [ 'double', [ 'double' ] ]
});
console.log(libm.ceil(1.5)); // 2

// You can also access just functions in the current process by passing a null
var current = ffi.Library(null, {
	  'atoi': [ 'int', [ 'string' ] ]
});
console.log(current.atoi('1234')); // 1234
