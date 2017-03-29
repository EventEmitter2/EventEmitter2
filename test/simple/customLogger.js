
var simpleEvents= require('nodeunit').testCase;
var file = '../../lib/eventemitter2';
var EventEmitter2;

if(typeof require !== 'undefined') {
  EventEmitter2 = require(file).EventEmitter2;
}
else {
  EventEmitter2 = window.EventEmitter2;
}

module.exports = simpleEvents({

  'allow custom logger' : function (test) {

    var type = 'remove',
        listeners;

    var f = {
        error: function f() {
        }
    };

    var emitter = new EventEmitter2({ loggingObject: f });

    test.equal(emitter._loggingObject, f);
    test.done();
  },

  'default to `console`' : function (test) {

    var type = 'remove',
        listeners;

    var f = {
        error: function f() {
        }
    };

    var emitter = new EventEmitter2;

    test.equal(emitter._loggingObject, console);
    test.done();
  }
});
