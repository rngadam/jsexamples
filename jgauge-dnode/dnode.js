var fs = require('fs');
var http = require('http');
var shoe = require('shoe');
var ecstatic = require('ecstatic')(__dirname + '/static');
var dnode = require('dnode');

var server = http.createServer(ecstatic);
server.listen(9999);

var previousValue;

function readLoadAvg(cb) {
	fs.readFile('/proc/loadavg', function(err, data) {
		values = data.toString().split(' ').map(parseFloat);
		cb({one: values[0], five: values[1], fifteen: values[2] });
	});
}

var sock = shoe(function (stream) {
    var d = dnode({
        loadavg: readLoadAvg
    });
    d.pipe(stream).pipe(d);
});
sock.install(server, '/dnode')