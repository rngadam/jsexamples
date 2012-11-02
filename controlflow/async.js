var async = require('async');
var path = require('path');
var fs = require('fs');
var aa = require('./asyncadapters.js');
var _ = require('underscore');
var testdir = './testdir';

exports.getConfigurations = function(callback) {
	var files;
	async.waterfall([
		function(cb) {
			console.log('reading files');
			fs.readdir(testdir, cb);
		},
		function(dirs, cb) {
			console.log('getting full path');
			async.map(dirs, aa.appendDir.bind(null, testdir), cb);
		},
		function(dirs, cb) {
			console.log('testing directory');
			// bind first parameter is context, second is error but
			// filter only calls a callback with a single value 
			// collecting all the results
			async.filter(dirs, aa.isDirectory, cb.bind(null, null));
		},
		function(dirs, cb) {
			console.log('getting config name');
			async.map(dirs, aa.getConfigName, cb);
		},
		function(candidateConfigFiles, cb) {
			console.log('testing config name');
			async.filter(candidateConfigFiles, aa.isFile, cb.bind(null, null));
		},
		function(configFiles, cb) {
			files = configFiles;
			console.log('reading config data');
			async.map(configFiles, fs.readFile, cb);
		}, 
		function(configFiles, cb) {
			console.log('converting buffer to string');
			async.map(configFiles, aa.toString, cb);
		}, 		
		function(configContent, cb) {
			console.log('parsing config data');
			async.map(configContent, aa.parseJSON, cb);
		}, 
		function(parsedContent, cb) {
			cb(null, _.zip(files, parsedContent));
		}
		], callback);
}