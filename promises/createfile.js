var Q = require("q");
var mkdirp = require('mkdirp');
var fs = require("fs");
var path = require('path');

function dirPromise(dirname) {
	console.log(arguments);
	var d = Q.defer();
	fs.mkdir(dirname, d.makeNodeResolver());
	console.log('returning dir promise');
	return d.promise;
}

function filePromise(fullpath) {
	console.log(arguments);
	var d = Q.defer();
	fs.writeFile(fullpath, 'test data', d.makeNodeResolver());
	console.log('returning file promise');
	return d.promise;
}

function contentPromise(fullpath) {
	console.log(arguments);	
	var d = Q.defer();
	console.dir(d.resolve);
	fs.readFile(fullpath, d.makeNodeResolver());
	console.log('returning content promise');
	return d.promise;
}

function errhandler(err) {
	console.log(err);
}
var dirname = './testdir';
var filename = 'hello';
var fullpath = path.join(dirname, filename);
var content = dirPromise(dirname)
	.then(function() { return filePromise(fullpath)} , errhandler)
	.then(function() { return contentPromise(fullpath)}, errhandler)
	.then(function(content) {console.log('promise returned: ' + content);})
	.end();
 
