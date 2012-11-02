var Q = require("q");
var mkdirp = require('mkdirp');
var fs = require("fs");
var path = require('path');

function dirPromise(dirname) {
	return Q.ncall(fs.mkdir, fs, dirname);
}

function filePromise(fullpath) {
	return Q.ncall(fs.mkdir, fs, fullpath, 'test data');
}

function contentPromise(fullpath) {
	return Q.ncall(fs.readFile, fs, fullpath);
}

function errhandler(err) {
	console.log(err);
}

var dirname = './testdir';
var filename = 'hello';
var fullpath = path.join(dirname, filename);
var content = dirPromise(dirname)
	.then(filePromise.bind(null, fullpath), errhandler)
	.then(contentPromise.bind(null, fullpath), errhandler)
	.then(function(content) {console.log('promise returned: ' + content);})
	.fin(function(data) {
		console.log('finalize call');
	})
	.end()
;
 
