var io = require('socket.io').listen(8080);
var fs = require('fs');
var redis = require('redis');

var previousValue = 0;

var store = redis.createClient()
var pub = redis.createClient()
var sub = redis.createClient()

var updaterId;

store.set('updater:counter', 0);

var updater = function() {
	fs.readFile('/proc/loadavg', function(err, data) {
		var str = data.toString();
		if(str !== previousValue) {
		  	previousValue = str;
			values = str.split(' ').map(parseFloat);
			json = JSON.stringify({one: values[0], five: values[1], fifteen: values[2] });
			store.set('proc:loadavg', json);
			pub.publish('proc:loadavg', json, redis.print);
		}
	});
}

var startUpdater = function() {
	store.incr('updater:counter', function(err, data) {
		var count = parseInt(data);
		if(count === 1) {
			updaterId = setInterval(updater, 1000);		
		}
	});	
}

var stopUpdater = function() {
	store.decr('updater:counter', function(err, data) {
		var count = parseInt(data);
		if(count == 0) {
			clearInterval(updaterId);		
		}
		if(count < 0) {
			store.set('updater:counter', 0);
		}
	});	
}

io.sockets.on('connection', function (socket) {
	startUpdater();
	sub.subscribe('proc:loadavg')
	sub.on('message', function(channel, json) {
	  	socket.emit('loadavg', json);			
	});

});

io.sockets.on('disconnection', function (socket) {
	console.log('disconnecting');
	stopUpdater();
	sub.unsubscribe();
});
