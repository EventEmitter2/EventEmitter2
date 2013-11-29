
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

  '1. Add two listeners on a single event and collect results.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    function functionA() {
      test.ok(true, 'The event was raised');
      return "A";
    }

    function functionB() {
      test.ok(true, 'The event was raised');
      return "B";
    }

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    var results = emitter.collect('test2');

    test.deepEqual([ "A", "B" ], results);

    test.expect(3);
    test.done();

  },  
  '2. Add two listeners on a single event and collect results twice.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    function functionA() {
      test.ok(true, 'The event was raised');
      return "A";
    }

    function functionB() {
      test.ok(true, 'The event was raised');
      return "B";
    }

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    var results = emitter.collect('test2').concat(emitter.collect('test2'));

    test.deepEqual([ "A", "B", "A", "B" ], results);

    test.expect(5);
    test.done();

  },
  '3. Add two listeners on a single event and collect results with a parameter.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    function functionA(value1) {
      test.ok(true, 'The event was raised');
      test.equal(typeof value1, 'string', 'The event was raised');
      return "A";
    }
  
    function functionB(value1) {
      test.ok(true, 'The event was raised');
      test.equal(typeof value1, 'string', 'The event was raised');
      return "B";
    }

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    var results = emitter.collect('test2', 'Hello, Node');

    test.deepEqual([ "A", "B" ], results);

    test.expect(5);
    test.done();

  },
  '4. Add two listeners on an single event and collect results twice with a parameter.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    function functionA(value1) {
      test.ok(true, 'The event was raised');
      test.equal(typeof value1, 'string', 'The event was raised');
      return "A";
    }
  
    function functionB(value1) {
      test.ok(true, 'The event was raised');
      test.equal(typeof value1, 'string', 'The event was raised');
      return "B";
    }

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    var results = emitter.collect('test2', 'Hello, Node1').concat(emitter.collect('test2', 'Hello, Node2'));

    test.deepEqual([ "A", "B", "A", "B" ], results);

    test.expect(9);
    test.done();

  },
  '5. Add two listeners on an single event and collect results twice with multiple parameters.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    function functionA(value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.equal(typeof value1, 'string', 'The value named "value1" is OK');
      test.equal(typeof value2, 'string', 'The value named "value2" is OK');
      test.equal(typeof value3, 'string', 'The value named "value3" is OK');
      return "A";
    }
  
    function functionB(value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.equal(typeof value1, 'string', 'The value named "value1" is OK');
      test.equal(typeof value2, 'string', 'The value named "value2" is OK');
      test.equal(typeof value3, 'string', 'The value named "value3" is OK');
      return "B";
    }

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    var results = emitter.collect('test2', 'Hello, Node1', 'Hello, Node2', 'Hello, Node3')
      .concat(emitter.collect('test2', 'Hello, Node1', 'Hello, Node2', 'Hello, Node3'));

    test.deepEqual([ "A", "B", "A", "B" ], results);

    test.expect(17);
    test.done();

  },
  '6. Check return values of collect.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    function functionA() {
      test.ok(true, 'The event was raised');
      return "A";
    }

    emitter.on('test6', functionA);

    test.deepEqual([ "A" ], emitter.collect('test6'), 'collect should return a result after calling a listener');
    test.deepEqual([], emitter.collect('other'), 'collect should not return any results when no listener was called');

    emitter.onAny(functionA);
    test.deepEqual([ "A" ], emitter.collect('other'), 'collect should return a result after calling an onAny() listener');

    test.expect(5);
    test.done();
  },  

});

