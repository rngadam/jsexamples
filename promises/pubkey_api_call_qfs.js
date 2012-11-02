/*
* Things to keep in mind:
* -returns from one step flows to the next which may confuse promises varargs
* -functions to return promises in then() 
* -first step direct calling function that creates a promise
* -resolve to boolean (true, false), reject on exception - don't resolve on true and reject on false
* -chaining promises dynamically (variable number of steps) requires a dummy promise that resolves immediately
* -two steps: determine current state, use switch with fallthroughs to bring it up to expected state
* -call end() to bubble up exceptions
* -err.stack to get the stacktrace
* -split functions returning longer promises from steps
* -create or use libraries (such as q-fs) to wrap calls into q promises
*/
var Q = require("q");
var mkdirp = require('mkdirp');
var fs = require("q-fs");
var path = require('path');
var assert = require('assert');

var States = {
	RETURN_KEY: 0,
	LOAD_KEY: 1,
	GENERATE_KEY: 2,
	CREATE_DIRECTORY: 3
};

var dirname = './testdir';
var filename = 'hello';
var fullpath = path.join(dirname, filename);

function errhandler(msg, err) {
	console.log(msg + ': ' + err.stack);
}

var key = null;

function isValidKeyPromise(key) {
	var d = Q.defer();
	if(!key) 
		d.resolve(false);
	else 
		d.resolve(true);
	return d.promise;
}

function determineStartStateFromDirectory(exist) {
	if(exist) { // DIRECTORY EXIST
		return States.GENERATE_KEY; //RESOLVED	
	} else {
		return States.CREATE_DIRECTORY; // RESOLVED	
	}
	console.log('directory exist');		
}
function determineStartStateFromDisk(exist) { 
	if(exist) { // FILE EXIST
		return States.LOAD_KEY; // RESOLVED
	} else {
		console.log('file does not exist');
		return fs.isDirectory(dirname).then(determineStartStateFromDirectory);
	}
}
	
function determineStartState(valid) { 
	if(valid) { // KEY IS VALID
		console.log('key is valid');
		return States.RETURN_KEY; // RESOLVED
	} else {
		console.log('key is invalid');
		return fs.isFile(fullpath).then(determineStartStateFromDisk);
	}
}

function applyChanges(startState) {
	var d = Q.defer();
	var promise = d.promise;
	// chain promises based on what needs doing
	switch(startState) { // fallthrough switch
		case States.CREATE_DIRECTORY:
		 	promise = promise.then(
		 		function() {
				console.log('creating directory: ' + dirname);
		 			return fs.makeDirectory(dirname);
		 		}
		 	);
		case States.GENERATE_KEY:
			promise = promise.then(
				function() { 
					console.log('generating key: ' + fullpath);
					return fs.write(fullpath, 'simulated key');
				}
			);			
		case States.LOAD_KEY:
			promise = promise.then(
				function() { 
					console.log('loading key: ' + fullpath)
					return fs.read(fullpath);
				}
			);
		case States.RETURN_KEY:
			promise = promise.then(
				function(content) {
					console.log('resolving to: ' + content);
					return content;
				}
			);
			break;
		default:
			d.reject('unsupported start state: ' + startState);
			return;
	}
	d.resolve(true);
	return promise;
}

isValidKeyPromise(key).then(
	determineStartState,
	errhandler.bind(null, 'error determining current state')
).then(
	applyChanges,
	errhandler.bind(null, 'failed determining state')
).then(
	function(key) { 
		console.log("custom step on key: " + key)
	},
	errhandler(null, 'failed retrieving key')
).end();