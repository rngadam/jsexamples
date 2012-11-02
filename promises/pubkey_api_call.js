var Q = require("q");
var mkdirp = require('mkdirp');
var fs = require("fs");
var path = require('path');
var assert = require('assert');

var dirname = './testdir';
var filename = 'hello';
var fullpath = path.join(dirname, filename);

function isFilePromise(fullpath) {
	assert(fullpath, 'path required');
	return Q.ncall(fs.stat, fs, fullpath).then(
		function(stat) {
			var d = Q.defer();
			if(stat.isFile()) {
				d.resolve(true);
			} else {
				d.reject(false);
			}
			return d.promise;
		}
	);
}

function isDirPromise(dirname) {
	assert(dirname, 'path required');
	return Q.ncall(fs.stat, fs, dirname).then(
		function(stat) {
			var d = Q.defer();
			if(stat.isDirectory()) {
				d.resolve(true);
			} else {
				d.reject(false);
			}
			return d.promise;
		}
	);
}

function dirPromise(dirname) {
	assert(dirname, 'path required');
	return Q.ncall(fs.mkdir, fs, dirname);
}

function filePromise(fullpath, data) {
	assert(fullpath, 'path required');	
	return Q.ncall(fs.writeFile, fs, fullpath, data);
}

function contentPromise(fullpath) {
	assert(fullpath, 'path required');	
	return Q.ncall(fs.readFile, fs, fullpath);
}

function errhandler(msg, err) {
	console.log(msg + ': ' + err);
}

function isValidKeyPromise(key) {
	var d = Q.defer();
	if(!key) 
		d.reject('invalid key');
	else 
		d.resolve(true);
	return d.promise;
}

var States = {
	RETURN_KEY: 0,
	LOAD_KEY: 1,
	GENERATE_KEY: 2,
	CREATE_DIRECTORY: 3
};


var startState = States.RETURN_KEY;
var key = null;

var startStatePromise = isValidKeyPromise(key).then(
	function() { // KEY IS VALID
		console.log('key is valid');
		return States.RETURN_KEY; // RESOLVED
	},
	function(err) { // KEY IS INVALID
		console.log('key is invalid: ' + err);
		return isFilePromise(fullpath).then( // chain promises
			function() { // FILE EXIST
				console.log('file exist');
				return States.LOAD_KEY; // RESOLVED
			},
			function(err) { // FILE DOES NOT EXIST
				console.log('file does not exist: ' + err);
				return isDirPromise(dirname).then( 
					function() { // DIRECTORY EXIST
						console.log('directory exist');
						return States.GENERATE_KEY; //RESOLVED
					},
					function(err) { // DIRECTORY DOES NOT EXIST
						console.log('directory does not exist: ' + err);
						return States.CREATE_DIRECTORY; // RESOLVED
					}
				)
			}
		)
	});

var keyPromise = startStatePromise.then(
	function(startState) {
		var d = Q.defer();
		var promise = d.promise;
		// chain promises based on what needs doing
		switch(startState) { // fallthrough switch
			case States.CREATE_DIRECTORY:
				console.log('creating directory: ' + dirname);
			 	promise = promise.then(
			 		dirPromise.bind(null, dirname),
			 		errhandler.bind(null, 'while creating directory'));
			case States.GENERATE_KEY:
				console.log('generating key: ' + fullpath);
				promise = promise.then(
					filePromise.bind(null, fullpath, 'simulated key'), 
			 		errhandler.bind(null, 'while generating key'));
			case States.LOAD_KEY:
				console.log('loading key: ' + fullpath)
				promise = promise.then(
					contentPromise.bind(null, fullpath), 
			 		errhandler.bind(null, 'while loading key'));
			case States.RETURN_KEY:
				promise = promise.then(
					function(content) {
						console.log('resolving to: ' + content);
						return content;
					},
			 		errhandler.bind(null, 'while returning key'));
				break;
			default:
				d.reject('unsupported start state: ' + startState);
				return;
		}
		d.resolve(true);
		return promise;
	},
	function(err) {
		console.log('failed determining start state: ' + err);
	}
);

keyPromise.end();