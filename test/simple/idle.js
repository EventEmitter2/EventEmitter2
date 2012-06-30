var simpleEvents = require('nodeunit').testCase;

var file = '../../lib/eventemitter2';

module.exports = simpleEvents({

  setUp: function (callback) {
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require(file).EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    this.emitter = new EventEmitter2({ verbose: true });
    callback();
  },

  tearDown: function (callback) {
    //clean up?
    callback();
  },

  '1. Add an idletimer and do not emit the event.': function (test) {

    var emitter = this.emitter;

    function callback() {
      test.ok(true, 'The event was raised');
      test.expect(1);
      test.done();
    }

    emitter.idle('test', 1, callback);
  },

  '2. Add an idletimer and emit the event.': function (test) {

    var emitter = this.emitter;

    function callback() {
      test.ok(true, 'Then the idle event was raised');
      test.expect(2);
      test.done();
    }

    emitter.idle('test', 1, callback);
    emitter.on('test', function () {
      test.ok(true, 'The correct event was raised');
    });

    emitter.emit('test');
  },

  '3. Add an idletimer and pass arguments.': function (test) {

    var emitter = this.emitter;

    function callback(event, arg1, arg2) {
      test.ok(true, 'Then the idle event was raised');
      test.equal(arg1, 'some', 'The first argument is correct');
      test.equal(arg2, 'arguments', 'The second argument is correct');
      test.expect(3);
      test.done();
    }

    emitter.idle('test', 1, callback, 'some', 'arguments');

    emitter.emit('test');
  },

});

