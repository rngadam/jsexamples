var suite = new Benchmark.Suite;

var asyncblock = require('./asyncblock.js');
var async = require('./async.js');
var sync = require('./sync.js');
var q = require('Q');
// add tests
suite.add('asyncblock', function() {
	asyncblock.getConfigurations();
})
.add('async', function() {
  async.getConfigurations();
})
.add('sync', function() {
  sync.getConfigurations();
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run();