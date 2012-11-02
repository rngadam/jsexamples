var assert = require('assert');

var TestObject = function() {
  var self = this;
  self.write = function(value, cb) {
    cb(null, 'wrote ' + value);
  };
  self.read = function(cb) {
    cb(null, 42);
  };
  self.getter = function() {
    return 52;
  };
};

function getParameterNames(fnc) {
  assert(fnc instanceof Function, 'should be a function, got ' + fnc);
  var m = fnc.toString().match(/function .*\((.*)\)/)
  if(m) {
    var names = m[1].match(/\w+/g);
    if(names) {
      return names;
    }
  }
  return [];
}

function res(err, result) {
  console.log(result);
}

global.callback = res;

function wrapFunction(name, fnc) {
  global[name] = fnc;
  var params = getParameterNames(fnc);
  console.log('params: ' + params);
  var lastParam = params.length ? params[params.length-1].toString() : "";
  console.log('param ' + lastParam);
  if(lastParam === 'cb') {
    console.log('replacing callback ' + params);
    params.pop();
    params.push(
      'console.log("intercept with callback");\n' +
      'var args = Array.prototype.slice.call(arguments);\n' +
      'args.push(global.callback);\n' +
      'return global["' + name + '"].apply(this, args);\n');
  } else {
    console.log('replacing with plain call ' + params);
    params.push(
      'console.log("plain intercept");\n' +
      'return global["' + name + '"].apply(this, arguments);\n');
  }

  var wrappedFunction = Function.constructor.apply(this, params);
  assert(wrappedFunction);
  return wrappedFunction;
}

function wrapObjectSocketStream(object) {
  var set = {};
  Object.keys(object).forEach(function(key) {
    if(key[0] !== '_' && object[key] instanceof Function) {
      console.log('wrapping ' + key)
      var fnc = object[key];
      set[key] = wrapFunction(key, fnc);
    }
  });
  return set;
}

var testObject = new TestObject();

var wrappedObject = wrapObjectSocketStream(testObject);

assert(wrappedObject.write instanceof Function);
assert(wrappedObject.read instanceof Function);

wrappedObject.write(5);
wrappedObject.read();
console.log('returned value: ' + wrappedObject.getter());