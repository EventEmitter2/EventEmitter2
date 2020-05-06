var assert= require('assert');
var simpleEvents = require('nodeunit').testCase;
var file = '../../lib/eventemitter2';
var EventEmitter2;

if(typeof require !== 'undefined') {
  EventEmitter2 = require(file).EventEmitter2;
}
else {
  EventEmitter2 = window.EventEmitter2;
}

module.exports = simpleEvents({

  '1. Add a single listener on a single event.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    test.equal(emitter.listeners('test1').length, 1, 'There are three emitters');

    test.expect(1);
    test.done();

  },
  '2. Add two listeners on a single event.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    test.equal(emitter.listeners('test1').length, 2, 'There are three emitters');

    test.expect(1);
    test.done();

  },
  '3. Add three listeners on a single event.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    test.equal(emitter.listeners('test1').length, 3, 'There are three emitters');

    test.expect(1);
    test.done();

  },
  '4. Add two listeners to two different events.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.on('test2', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.on('test2', function () {
      test.ok(true, 'The event was raised');
    });

    test.equal(emitter.listeners('test1').length, 2, 'There are two emitters');
    test.equal(emitter.listeners('test2').length, 2, 'There are two emitters');

    test.expect(2);
    test.done();

  },
  '5. Never adding any listeners should yield a listeners array with the length of 0.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    test.equal(emitter.listeners('test2').length, 0, 'There are no emitters');

    test.expect(1);
    test.done();
  },

  '6. the listener added should be the right listener.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    var type = 'somelistenerbar';
    var f = function () {};

    emitter.on(type, f);
    test.equal(emitter.listeners(type).length, 1, 'There are is one emitters');
    test.equal(emitter.listeners(type)[0], f, 'The function should be f');

    test.expect(2);
    test.done();

  },

  '7. should be able to listen on any event' : function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    var eventBeingTestedFor, expectedArgument;
    var f = function (event, argument) {
      test.ok(true, 'the event was fired');
      test.ok(eventBeingTestedFor === event, 'the event is '+event);
      test.ok(expectedArgument === argument, 'the argument is '+argument)
    };

    emitter.onAny(f);
    emitter.emit(eventBeingTestedFor = 'test23.ns5.ns5', expectedArgument = 'someData'); //1
    emitter.offAny(f);
    expectedArgument = undefined;
    emitter.emit(eventBeingTestedFor = 'test21'); //0
    emitter.onAny(f);
    emitter.onAny(f);
    emitter.emit(eventBeingTestedFor = 'test23.ns5.ns5', expectedArgument = 'someData'); //3

    test.expect(3*3);
    test.done();

  },

  '8. should be able to listen on any event (should cause an error)' : function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    var f = function () {
      test.ok(true, 'the event was fired');
    };
    emitter.onAny(f);

    emitter.emit('error');

    test.expect(1);
    test.done();

  },

  '9. onAny alias' : function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    var f = function () {
      test.ok(true, 'the event was fired');
    };

    emitter.on(f);

    emitter.emit('foo');
    emitter.emit('bar');

    test.expect(2);
    test.done();

  },

  '10. onAny with invalid argument' : function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    test.throws(function () {
      emitter.onAny(null);
    }, 'An exception should be thrown');

    test.ok(!emitter.emit('foo'), 'emit should not return true');

    test.expect(2);
    test.done();

  },

  '11. listenerCount should return the number of listeners': function (test) {


    var emitter = new EventEmitter2({ verbose: true });

    test.equal(emitter.listenerCount('test1'), 0, 'Before adding listeners listenerCount is 0');

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    test.equal(emitter.listenerCount('test1'), 1, 'After adding a listener listenerCount is 1');

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    test.equal(emitter.listeners('test1').length, 2, 'And then there were 2');

    test.expect(3);
    test.done();

  },

  '12. should support wrapping handler to an async listener': function (done) {
    var ee= new EventEmitter2();
    var counter= 0;
    var f= function(x){
      assert.equal(x, 123);
      counter++;
    };
    ee.on('test', f, false);
    assert.equal(ee.listenerCount(), 1);
    ee.emit('test', 123);
    assert.equal(counter, 0, 'the event was emitted synchronously');
    setTimeout(function(){
      assert.equal(counter, 1);
      ee.off('test', f);
      assert.equal(ee.listenerCount(), 0);
      done();
    }, 10);
  },

  '13. should support wrapping handler to a promised listener using setImmediate': function (done) {
    var ee= new EventEmitter2();
    var counter= 0;
    var f= function(x){
      assert.equal(x, 123);
      counter++;
      return x + 1;
    };

    ee.on('test', f, {promisify: true});

    ee.emitAsync('test', 123).then(function(arg){
      assert.equal(counter, 1);
      assert.equal(arg, 124);
      done();
    }, done);

    assert.equal(counter, 0,'the event was emitted synchronously');
  },

  '13. should support wrapping handler to an async listener using nextTick': function (done) {
    var ee= new EventEmitter2();
    var counter= 0;
    var f= function(x){
      assert.equal(x, 123);
      counter++;
    };
    ee.on('test', f, {nextTick: true});
    assert.equal(ee.listenerCount(), 1);
    ee.emit('test', 123);
    assert.equal(counter, 0, 'the event was emitted synchronously');
    process.nextTick(function(){
      assert.equal(counter, 1);
      ee.off('test', f);
      assert.equal(ee.listenerCount(), 0);
      done();
    });
  },

  '14. should support wrapping once listener to an async listener': function (done) {
    var ee = new EventEmitter2();
    var counter = 0;
    var f = function (x) {
      assert.equal(x, 123);
      counter++;
    };
    ee.once('test', f, false);
    assert.equal(ee.listenerCount(), 1);
    ee.emit('test', 123);
    assert.equal(counter, 0, 'the event was emitted synchronously');
    setTimeout(function () {
      assert.equal(counter, 1);
      ee.off('test', f);
      assert.equal(ee.listenerCount(), 0);
      done();
    }, 10);
  },

  '15. should support returning a listener object if the objectify options is set': function () {
    var ee = new EventEmitter2();
    var counter = 0;
    var handler = function (x) {
      assert.equal(x, 123);
      counter++;
    };

    var listener= ee.on('test', handler, {
      objectify: true
    });

    assert.equal(typeof listener, 'object');
    assert.equal(listener.constructor.name, 'Listener');
    assert.equal(typeof listener.off, 'function');
    assert.equal(listener.emitter, ee);
    assert.equal(listener.event, 'test');
    assert.equal(listener.listener, handler);

    assert.equal(counter, 0);

    ee.emit('test', 123);
    assert.equal(counter, 1);

    listener.off();

    ee.emit('test', 123);
    assert.equal(counter, 1);
  },

  '16. should support returning a listener object using the `once` method if the objectify options is set': function () {
    var ee = new EventEmitter2();
    var counter = 0;
    var handler = function (x) {
      assert.equal(x, 123);
      counter++;
    };

    var listener= ee.once('test', handler, {
      objectify: true
    });

    assert.equal(typeof listener, 'object');
    assert.equal(listener.constructor.name, 'Listener');
    assert.equal(typeof listener.off, 'function');
    assert.equal(listener.emitter, ee);
    assert.equal(listener.event, 'test');
    assert.equal(listener.listener._origin, handler);

    assert.equal(counter, 0);

    listener.off();

    ee.emit('test', 123);

    assert.equal(counter, 0);
  }
});
