var path = require('path');
var fs = require('fs');

exports.getConfigName = function(dirname, cb) {
	cb(null, exports.getConfigNameSync(dirname));
}

exports.getConfigNameSync = function(dirname) {
	return path.join(dirname, 'socketstream.json');
}

exports.appendDir = function(testdir, target, cb) {
	cb(null, exports.appendDirSync(testdir, target));
}

exports.appendDirSync = function(testdir, target) {
	return path.join(testdir, target);
}

exports.postfix = function(file, dir) {
	return path.join(dir, file);
}

exports.isFile = function(filename, cb) {
	fs.stat(filename, function(err, stat) {
		if(err) cb(false);
		// The callback for each iterator call only accepts a single argument
		// of true or false, it does not accept an error argument first!
		else cb(stat.isFile());
	});
}

exports.isDirectory = function(dirname, cb) {
	fs.stat(dirname, function(err, stat) {
		console.log('stat on ' + dirname);
		if(err) {
			console.log('err ' + err);
			cb(false);
		} else {
			console.log('is directory ' + stat.isDirectory());
			cb(stat.isDirectory()); 
		}
	});
}

exports.isFileSync = function(filename) {
	return fs.statSync(filename).isFile();
}

exports.isDirectorySync = function(filename) {
	return fs.statSync(filename).isDirectory();
}
exports.toString = function(buffer, cb) {
	cb(null, buffer.toString());
}

exports.parseJSON = function(data, cb) { 
	cb(null, JSON.parse(data))
}

exports.log = function(err, data) {
	if(err) console.log(err.stack);
	else console.log(data);
}

exports.debug = function(h) {
	console.log(h);
	return h;
}
exports.testdir = './testdir';