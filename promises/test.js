var Q = require("q");

var delay = function (delay) {
	    var d = Q.defer();
		setTimeout(d.resolve, delay);
		return d.promise;
};

delay(1000)
.then(function () { console.log('Hello, World...once!'); })
.then(function() { return delay(1000); })
.then(function () { console.log('Hello, World...twice!'); });
