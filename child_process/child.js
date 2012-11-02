var target = process.argv[2];

process.on('message', function(m, payload) {
  if (m === 'server') {
	console.log('message received!');
  }
});

//process.send({target: target, command: 'killme'});

process.exit(0);