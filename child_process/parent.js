var child_process = require('child_process');

function clientMessageReceiver(m) {
	console.log('PARENT got message:', m);
	if(m.command == 'killme') {
		childs[m.target].kill();
	}
}

function clientExitReceiver(code) {
  console.log('CHILD process exited with code ' + code);
}

function fork(dir) {
	var child = child_process.fork(
		'child.js', [dir, '0.0.0.0', '0']);
	child.on('message', clientMessageReceiver);
	child.on('exit',  clientExitReceiver);
	return child;
}

childs = {}
dirs = ['/home/lophilo/test1', '/home/lophilo/test2'];

for(var i in dirs) {
	var dir = dirs[i];
	childs[dir] = fork(dir);
}