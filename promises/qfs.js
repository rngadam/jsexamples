var Q = require("q");
var mkdirp = require('mkdirp');
var fs = require("q-fs");
var path = require('path');

var dirname = './testdir';
var filename = 'hello';
var fullpath = path.join(dirname, filename);

function errhandler(err) {
	console.log(err);
}

var content = fs.makeDirectory(dirname)
	.then(fs.write.bind(null, fullpath, 'test data'), errhandler)
	.then(fs.read.bind(null, fullpath), errhandler)
	.then(function(content) {console.log('promise returned: ' + content); return content;})
	.end();
 
