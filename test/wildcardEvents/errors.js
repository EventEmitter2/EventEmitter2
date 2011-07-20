var basicEvents = require('nodeunit').testCase;

/////helper///////
function setHelper (emitter, test, testName){
  var eventNames = [
    testName, 
    testName + '.*', 
    testName + '.ns1', 
    testName + '.ns1.ns2', 
    testName + '.ns2.*'
  ];

  for (var i = 0; i < eventNames.length; i++) {
    emitter.on(eventNames[i], function () { 
        test.ok(true, eventNames[i] + 'has fired');
    });
  }

  return eventNames;
};

module.exports = basicEvents({

  setUp: function (callback) {
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    this.emitter = new EventEmitter2({ 
      wildcard: true,
      verbose: true
    });

    callback();
  },

  tearDown: function (callback) {
    //clean up?
    callback();
  },

  'error 1. Should emit an error event if trying to register a bad name' : function (test) {
    var emitter = this.emitter;

    emitter.on('error', function (error) {
      test.ok(true, 'An error event was raised' );
    });

    // Add bad events
    emitter.on('.foo', function () {
      test.ok(false, 'The event .ns4 was raised');
    });
    emitter.on('foo.', function () {
      test.ok(false, 'The event .ns4 was raised');
    });
    emitter.on('foo..bar', function () {
      test.ok(false, 'error was raised');
    });

    emitter.on('.foo..bar', function () {
      test.ok(false, 'error was raised');
    });
    emitter.on('foo..bar.', function () {
      test.ok(false, 'error was raised');
    });
    emitter.on('foo.bar.', function () {
      test.ok(false, 'error was raised');
    });
    emitter.on('.foo.bar', function () {
      test.ok(false, 'error was raised');
    });

    emitter.on('.foo..bar.', function () {
      test.ok(false, 'error was raised');
    });


    test.expect(8);
    test.done();
  },

  'error 2. should emit errors if trying to emit on a bad namespace' : function (test) {
    var emitter = this.emitter;

    emitter.on('error', function (error) {
      test.ok(true, 'An error event was raised');
    });

    emitter.emit('.foo');
    emitter.emit('foo.');
    emitter.emit('.foo.');
    emitter.emit('foo..bar');
    emitter.emit('foo.bar.');
    emitter.emit('.foo.bar');

    emitter.emit('.foo', 'a bad event name');
    emitter.emit('foo.', 'a bad event name');
    emitter.emit('foo..bar', 'a bad event name');

    test.expect(9);
    test.done();
  },

  'error 3. should throw an error if there is no error listener' : function (test) {
    var emitter = this.emitter;

    try {
      emitter.emit('.foo');
    }
    catch (err) {
      test.equal(typeof err, 'Error', 'caught the emit Error');
    }

    try {
      emitter.on('foo.', function () {});
    }
    catch (err) {
      test.equal(typeof err, 'Error', 'caught the on Error');
    }

    test.expect(2);
    test.done();
  },

  'error 4. should emit errors if trying to listen on misplaed wildcard' : function (test) {
    var emitter = this.emitter;

    emitter.on('error', function (error) {
      test.ok(true, 'Error event was emitted');
    });

    emitter.on('foo*', function () {});
    emitter.on('*foo', function () {});

    emitter.on('foo.bar*', function () {});
    emitter.on('*foo.bar', function () {});

    emitter.on('foo.**.bar', function () {});
    emitter.on('foo.*.bar*', function () {});
    emitter.on('*foo.*.bar', function () {});

    emitter.on('fo*o', function () {});
    emitter.on('foo.ba*.*', function () {});

    emitter.on('**', function () {});

    test.expect(8);
    test.done();
  },

  'error 5. should emit errors if trying to emit on misplaed wildcard' : function (test) {
    var emitter = this.emitter;

    emitter.on('error', function (error) {
      test.ok(true, 'Error event was emitted');
    });

    emitter.emit('foo*');
    emitter.emit('*foo');

    emitter.emit('foo.bar*');
    emitter.emit('*foo.bar');

    emitter.emit('foo.**.bar');
    emitter.emit('foo.*.bar*');
    emitter.emit('*foo.*.bar');

    emitter.emit('fo*o');
    emitter.emit('foo.ba*.*');

    emitter.emit('**');

    test.expect(8);
    test.done();
  },

  'error 6. should never add any badly named listeners' : function (test) {
    var emitter = this.emitter;

    emitter.on('error', function (error) {
      test.ok(true, 'Error was raised');
    });

    emitter.on('.foo', function () {});
    emitter.on('foo.', function () {});
    emitter.on('foo..bar', function () {});

    test.equal(0, emitter.listeners('foo').length, 'foo should be length 0');
    test.equal(0, emitter.listeners('.foo').length, 'foo should be length 0');
    test.equal(0, emitter.listeners('foo.').length, 'foo should be length 0');
    test.equal(0, emitter.listeners('foo..bar').length, 'foo..bar should be length 0');
    test.equal(0, emitter.listeners('foo.bar').length, 'foo.bar should be length 0');
    test.equal(0, emitter.listeners('foobar').length, 'foobar should be length 0');

    test.expect(9);
    test.done();
  },

});
