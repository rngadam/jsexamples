var asyncblock = require('asyncblock');
var async = require('async');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var aa = require('./asyncadapters.js');

exports.getConfigurations = function(callback) {
	asyncblock(function(flow) {
		fs.readdir(aa.testdir, flow.set('dirs'));
		async.map(
			flow.get('dirs'), 
			aa.appendDir.bind(null, aa.testdir), 
			flow.set('absdirs')
		);
		async.filter(
			flow.get('absdirs'), 
			aa.isDirectory, 
			flow.set({firstArgIsError: false, key: 'realDirs'})
		);
		console.log(flow.get('realDirs'));
		async.map(
			flow.get('realDirs'), 
			aa.getConfigName, 
			flow.set('candidateConfigFiles')
		);
		console.log(flow.get('candidateConfigFiles'));
		async.filter(
			flow.get('candidateConfigFiles'), 
			aa.isFile, 
			flow.set({firstArgIsError: false, key: 'configFiles'})
		);
		console.log(flow.get('configFiles'));
		async.map(
			flow.get('configFiles'), 
			fs.readFile, //return buffers
			flow.set('configFilesContent')
		);	
		console.log(flow.get('configFilesContent'));
		async.map(
			flow.get('configFilesContent'), 
			aa.toString, 
			flow.set('configFilesString')
		);	
		console.log(flow.get('configFilesString'));	
		async.map(
			flow.get('configFilesString'), 
			aa.parseJSON,
			flow.set('configData')
		);
		console.log(flow.get('configData'));
		var result = _.zip(flow.get('configFiles'), flow.get('configData'));
		return result;
	}, callback);
}
