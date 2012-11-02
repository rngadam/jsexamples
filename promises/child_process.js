var exec = require('child_process').exec;

exec('gedit &', function() {
});
process.exit(0);
