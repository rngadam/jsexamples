var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var aa = require('./asyncadapters.js');

exports.getConfigurations = function(callback) {
	var configFiles = _.chain(fs.readdirSync(aa.testdir))
		.map(path.join.bind(null, aa.testdir))
		.filter(aa.isDirectorySync)
		.map(aa.postfix.bind(null, 'socketstream.json'))
		.filter(aa.isFileSync)
		.value();

	var configs = _.chain(configFiles)
		.map(fs.readFileSync)
		.invoke('toString')
		.map(JSON.parse)
		.value();

	callback(null, _.zip(configFiles, configs))
}