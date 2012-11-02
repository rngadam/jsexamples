var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

function updater(remote) {
	remote.loadavg(updateGauge);
}

domready(function () {
    var result = document.getElementById('result');
    var stream = shoe('/dnode');

    var d = dnode();
    d.on('remote', function (remote) {
        setInterval(updater.bind(null, remote), 1000);	
    });
    d.pipe(stream).pipe(d);
});