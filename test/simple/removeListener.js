
var simpleEvents= require('nodeunit').testCase;
var file = '../../lib/eventemitter2';
var EventEmitter2;

if(typeof require !== 'undefined') {
  EventEmitter2 = require(file).EventEmitter2;
}
else {
  EventEmitter2 = window.EventEmitter2;
}

const setupRemoveListenerTest = (times) => {
  const emitter = new EventEmitter2;
  const type = 'remove';
  const f = registerRemoveListeners(emitter, type, times);

  return {emitter, type, f};
}

const registerRemoveListeners = (emitter, type, times) => {
  const f = function f() {
    test.ok(true, 'event was raised');
  };

  for (let i = 0; i < times; i++) {
    emitter.on(type, f)
  }

  return f;
};

module.exports = simpleEvents({

  'removeListener1. adding 1, removing 1' : function (test) {

    const {emitter, type, f} = setupRemoveListenerTest(1);
    let listeners;
    
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 1, 'should only have 1');

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 0, 'should be 0');

    test.expect(2);
    test.done();
  },

  'removeListener2. adding 2, removing 1' : function (test) {

    const {emitter, type, f} = setupRemoveListenerTest(2);
    let listeners;

    listeners = emitter.listeners(type);
    test.equal(listeners.length, 2, 'should only have 2');

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 1, 'should be 1');

    test.expect(2);
    test.done();
  },

  'removeListener3. adding 3, removing 1' : function (test) {

    const {emitter, type, f} = setupRemoveListenerTest(3);
    let listeners;

    listeners = emitter.listeners(type);
    test.equal(listeners.length, 3, 'should only have 3');

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 2, 'should be 2');

    test.expect(2);
    test.done();
  },

  'removeListener4. should error if we don\'t pass in a function' : function (test) {

    const {emitter, type, f} = setupRemoveListenerTest(1);
    let listeners;

    listeners = emitter.listeners(type);
    test.equal(listeners.length, 1, 'should only have 1');

    //remove
    test.throws(function () {emitter.removeListener(type, type)}, Error, 'should throw an Error');
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 1, 'should be 1');

    test.expect(3);
    test.done();
  },

  'removeListener5. removing a different function, should not remove' : function (test) {

    var emitter = new EventEmitter2;
    var type = 'remove',
        listeners;

    var f = function f() {
      test.ok(true, 'event was raised');
    };
    var g = function g() {
      test.ok(true, 'event was raised');
    };

    emitter.on(type, f);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 1, 'should only have 1');

    //remove
    emitter.removeListener(type, g);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 1, 'should be 1');

    test.expect(2);
    test.done();
  },

  'removeListener6. removing all functions by name' : function (test) {

    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

    listeners = emitter.listeners(type);
    test.equal(listeners.length, 10, 'should only have 10');

    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 9, 'should be 9');
    emitter.removeAllListeners(type);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 0, 'should be 0');

    test.expect(3);
    test.done();
  },

  'removeListener7. removing different event, should not remove' : function (test) {

    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

    listeners = emitter.listeners(type);
    test.equal(listeners.length, 10, 'should only have 10');

    emitter.removeListener(type+type, f);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 10, 'should be 10');

    emitter.removeAllListeners(type+type);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 10, 'should be 10');

    emitter.removeAllListeners(type);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 0, 'should be 0');

    test.expect(4);
    test.done();
  },

  'removeListener8. when _events doesn\'t exist' : function (test) {

    var emitter = new EventEmitter2;
    var type = 'remove';

    delete emitter._events;
    emitter.removeAllListeners();
    emitter.removeAllListeners(type);

    test.expect(0);
    test.done();
  },

  'removeListener9. removing all functions - no argument provided' : function(test) {

    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

    listeners = emitter.listeners(type);
    test.equal(listeners.length, 10, 'should only have 10');

    emitter.removeAllListeners();
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 0, 'should be 0');

    test.expect(2);
    test.done();
  },

  'removeListener10. removing all functions - argument provided is "undefined"' : function(test) {

    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

    listeners = emitter.listeners(type);
    test.equal(listeners.length, 10, 'should only have 10');

    emitter.removeAllListeners(undefined);
    listeners = emitter.listeners(type);
    test.equal(listeners.length, 0, 'should be 0');

    test.expect(2);
    test.done();
  }
});
