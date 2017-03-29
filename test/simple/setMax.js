
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

  'setMaxListener1. default behavior of 10 listeners.' : function (test) {

    var emitter = new EventEmitter2;

    for (var i = 0; i < 10; i++) {
      emitter.on('foobar', function () {
        test.ok(true, 'event was raised');
      });
    }

    var listeners = emitter.listeners('foobar');
    test.equal(listeners.length, 10, 'should only have 10');

    test.expect(1);
    test.done();
  },

  'setMaxListener2. If we added more than 10, should not see them' : function (test) {

    var emitter = new EventEmitter2;

    for (var i = 0; i < 10 ; i++) {
      emitter.on('foobar2', function () {
        test.ok(true, 'event was raised');
      });
    }
    console.log('should see EE2 complaining:');
    emitter.on('foobar2', function () {
      test.ok(true, 'event was raised');
    });

    var listeners = emitter.listeners('foobar2');
    test.equal(listeners.length, 11, 'should have 11');
    test.ok(emitter._events['foobar2'].warned, 'should have been warned');

    test.expect(2);
    test.done();
  },

  'setMaxListener3. if we set maxListener to be greater before adding' : function (test) {

    var emitter = new EventEmitter2;
    var type = 'foobar3';

    // set to 20
    emitter.setMaxListeners(20);

    for (var i = 0; i < 15 ; i++) {
      emitter.on(type, function () {
        test.ok(true, 'event was raised');
      });
    }

    var listeners = emitter.listeners(type);
    test.equal(listeners.length, 15, 'should have 15');
    test.ok(!(emitter._events[type].warned), 'should not have been set');

    test.expect(2);
    test.done();
  },

  'setMaxListener4. should be able to change it right at 10' : function (test) {

    var emitter = new EventEmitter2;
    var type = 'foobar4';

    for (var i = 0; i < 10 ; i++) {
      emitter.on(type, function () {
        test.ok(true, 'event was raised');
      });
    }

    emitter.setMaxListeners(9001);
    emitter.on(type, function () {
      test.ok(true, 'event was raised');
    });

    var listeners = emitter.listeners(type);
    test.equal(listeners.length, 11, 'should have 11');
    test.ok(!(emitter._events[type].warned), 'should not have been set');

    test.expect(2);
    test.done();
  },
  'setMaxListener5. if we set maxListener to be 0 should add endlessly' : function (test) {

    var emitter = new EventEmitter2;
    var type = 'foobar';

    // set to 0
    emitter.setMaxListeners(0);

    for (var i = 0; i < 25 ; i++) {
      emitter.on(type, function () {
        test.ok(true, 'event was raised');
      });
    }

    var listeners = emitter.listeners(type);
    test.equal(listeners.length, 25, 'should have 25');
    test.ok(!(emitter._events[type].warned), 'should not have been set');

    test.expect(2);
    test.done();
  },
  'setMaxListener6. if we set maxListener to be 1 should warn for 2 listeners' : function (test) {

    var emitter = new EventEmitter2;
    var type = 'ns1';

    emitter.setMaxListeners(1);

    emitter.on(type, function () {});
    emitter.on(type, function () {});

    test.ok(emitter._events[type].warned, 'should have been set');

    test.done();
  },
  'maxListeners parameter 1. Passing maxListeners as a parameter should override default.' : function (test) {

    var emitter = new EventEmitter2({
      maxListeners: 2
    });

    emitter.on('a', function () {});
    emitter.on('a', function () {});
    emitter.on('a', function () {});
    test.ok(emitter._events.a.warned,
      '.on() should warn when maxListeners is exceeded.');
    test.done();
  },
  'maxListeners parameter 2. Passing maxListeners with value 0 as a parameter should override default.' : function (test) {

    var emitter = new EventEmitter2({
      maxListeners: 0
    });
    var type = 'ns1';

    for (var i = 0; i < 12 ; i++) {
      emitter.on(type, function () {});
    }

    test.ok(!emitter._events[type].warned, 'should not have been set');
    test.done();
  },

  'should use process.emitWarning if available' : function (test) {

    // Don't run this test if `process.emitWarning` is not available
    if(typeof process === 'undefined' || !process.emitWarning) {
      test.done();
      return;
    }

    test.expect(2);

    var emitter = new EventEmitter2;

    process.once('warning', function(warning) {
      test.equal(warning.name, 'MaxListenersExceededWarning');
      test.equal(warning.count, 11);
      test.done();
    });

    for (var i = 0; i < 11 ; i++) {
      emitter.on('foobar2', function () {
      });
    }
  }
});
