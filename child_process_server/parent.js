"use strict";

var child_process = require('child_process');
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var assert = require('assert');

var childs = {}; // TODO: move store to redis

function clientMessageReceiver(m) {
	console.log('PARENT got message %s from process id %s:', JSON.stringify(m), m.id);
	assert(childs[m.id], 'message from client means the client should exist ' + m.id);
	switch(m.command) {
		case 'killme':
			childs[m.id].process.kill();
			break;
		case 'port':
			childs[m.id].port = m.port;
			childs[m.id].init(null, m.port);
			break;
		case 'signal':
			console.log('process id %s exited because of %s ', m.id, m.signal);
			childs[m.id].signal = m.signal;
			break;
		case 'exited':
			//childs[m.id].process = null;
			break;
		default:
			throw new Error('unsupported command request '+ m.command + ' from client ' + m.id);
	}
}

function start(id, script, params, cb) {
	if(childs[id]) {
		cb('already started ' + id, childs[id].port);
  	} else {
  		childs[id] = {}; // want to set callback before instantiating...
  	  	childs[id].init = cb;
  	  	childs[id].process  = child_process.fork(script, params);
		childs[id].process.on('message', clientMessageReceiver);
  	}
}

function stop(id, cb) {
  	if(childs[id]) {
  		if(!childs[id].process.killed) {
  			childs[id].process.kill();
	  		cb(null, 'killed ' + id);
  		} else {
  			cb('already killed ' + id);
  		}
  	} else {
  		cb('does not exist ' + id);
  	}
}

function list(cb) {
	console.log(childs);
	cb(null, childs);
}

function status(id, cb) {
	if(childs[id]) {
		cb(null, 'started: ' + id);
	} else {
		cb(null, 'unknown: ' + id);
	}
}

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var parsed = url.parse(req.url, true);
  var id = parsed.query.id;
  var action = parsed.query.action;
  var cb = function(err, message) {
  	if(err) res.write(err);
  	else res.write(message);
  	res.end();
  }

  switch(action) {
  	case 'start':
  		start(id, 'child.js', [id, path.join('/home/lophilo', id)], function(err, port) {
  			var host = req.headers.host;
  			res.write('http://' + host.split(':')[0] + ':' + port);
  			res.end();
  		});
  		break;
  	case 'stop':
  		stop(id, cb);
  		break;
  	case 'status':
  		status(id, cb);
  		break;
  	case 'list':
  		list(function(err, childs) {
  			res.write(JSON.stringify(childs));
  			res.end();
  		});
  		break;
  	default:
  		res.write('hello!');
  		res.end();
  		break;
  }
});

server.listen(8080);