var google = require('node-google-api')('AIzaSyBzEuqw-UtF4dk4IEZhSiAgd-oyvUOJbow');

google.build(function(api) {
    api.calendar.events.list({
        calendarId: 'en.usa#holiday@group.v.calendar.google.com'
    }, function(events) {
        for(var e in events.items) {
			//console.dir(events.items[e]);
            console.log(events.items[e].summary);
        }
    });
});
