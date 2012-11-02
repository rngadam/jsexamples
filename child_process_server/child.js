
function register(id, port) {
	process.send({
		command: 'port',
		id: id,
		port: port,
	});
}

function exitNotification(id) {
	process.send({command: 'exited', id: id });
}

function signalNotification(id, reason) {
	process.send({command: 'signal', id: id, reason: reason });
}

function setup(id, process) {
	process.title = id;

	process.on("uncaughtException", function(err) {
	  console.error("[uncaughtException]", err);
	  exitNotification(id, "uncaughtException");
	  return process.exit(1);
	});

	process.on("SIGTERM", function() {
	  console.log("SIGTERM");
	  exitNotification(id, "SIGTERM");
	  return process.exit(0);
	});

	process.on("SIGINT", function() {
	  console.log("SIGINT");
	  exitNotification(id, "SIGINT");
	  return process.exit(0);
	});

	process.on("exit", function() {
		exitNotification(id);
	});

}

var http = require('http');


var id = process.argv[2];
var dir = process.argv[3];

setup(id, process);

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(dir);
  res.end();
});

server.listen(0);
register(id, server.address().port);

