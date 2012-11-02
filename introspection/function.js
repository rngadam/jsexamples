var assert = require('assert');

function getParameterNames(fnc) {
  assert(fnc instanceof Function, 'should be a function, got ' + fnc);
  var m = fnc.toString().match(/function .*\((.*)\)/)
  if(m)
    return m[1].split(',');
  else
    return [];
}

var testFunction = function (a, b, cb) {
	return cb(null, a + b);
}

console.log('number of args: ' + testFunction.length);
console.log('name: ' + testFunction.name);
console.log('source:\n' + testFunction.toString());
console.log('parameter names: ' + getParameterNames(testFunction));

global['hello'] = 1;
assert(global['hello'] === 1);

function wrap(fnc) {
  global[fnc.name] = fnc;
  var params = getParameterNames(fnc);
  params.push(
    'console.log("hello");' +
    'console.log(arguments);' +
    'return global["' + fnc.name + '"].apply(this, arguments);');

  assert(global[fnc.name] instanceof Function, 'this object has testFunction');

  var wrapped = Function.constructor.apply(this, params);
  return wrapped;
}

function callback(err, result) {
  if(err) throw err;
  console.log(result);
}
wrapped = wrap(testFunction);
wrapped(1,2, callback);