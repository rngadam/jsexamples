var assert = require('assert');
var events = require('events');
var sys = require('sys');

var baseObject = {
  "hello": "world"
};

var Lophilo = function() {
  var self = this;
  self.hello = "world";

  self.m = function() {
    return "chewie";
  }
  Object.defineProperty(this, "_events", {
        enumerable: false,
        value: {}
  });
}
Lophilo.prototype = new require('events').EventEmitter;
sys.inherits(Lophilo, events.EventEmitter);

var lophilo;
describe('lophilo', function() {
  describe('extend', function() {
    before(function() {
      lophilo = new Lophilo();
    });
    it('newListener event internal to object', function(done) {
      lophilo.once('captured', function(event) {
          done();
      });
      lophilo.on('some other event', function() {});
      lophilo.on('newListener', function(event) {
        lophilo.emit('captured');
      });
    });
    it('newListener event ', function(done) {
      lophilo.on('newListener', function(event) {
        if(event === 'fakeevent')
          done();
      });
      lophilo.on('fakeevent', function() {});
    });
    it('event emitter', function(done) {
      lophilo.once('update', function(updates) {
        assert(updates[0] === 'an update');
        done();
      });
      lophilo.emit('update', ['an update']);
    });
    it('another property', function() {
      assert(lophilo.hello === "world");
    });
    it('another method', function() {
      assert(lophilo.m() === "chewie");
    });
    after(function() {
      lophilo.removeAllListeners();
    });
  });
});