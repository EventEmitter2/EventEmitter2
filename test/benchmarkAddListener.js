;!function(root) {

  // Check server side *require* availability.
  var req = (typeof require !== 'undefined');

  // Require *EventEmitter2* if it's not already present.
  var EventEmitter2 = root.EventEmitter2;
  if (!EventEmitter2 && req) EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
  if (!EventEmitter2) throw new Error('Dependency missing: EventEmitter2');

  // Require *EventEmitter2___old* if it's not already present.
  var EventEmitter2___old = root.EventEmitter2___old;
  if (!EventEmitter2___old && req) EventEmitter2___old = require('../lib/eventemitter2___old').EventEmitter2___old;
  if (!EventEmitter2___old) throw new Error('Dependency missing: EventEmitter2___old');

  var emitter = new EventEmitter2(),
      emitter___old = new EventEmitter2___old(),
      iterations = 100000000;

  root.testAddListenerOnNew = {
    '1. NEW: Add a single namespace listener': function(test) {
      var i = iterations;

      console.time('test1');

      while(i--) {
        emitter.on('single', function() {});
      }

      console.timeEnd('test1');

      test.done();
    },
    '2. NEW: Add a double namespace listener': function(test) {
      var i = iterations;

      console.time('test2');

      while(i--) {
        emitter.on('single.double', function() {});
      }

      console.timeEnd('test2');

      test.done();
    },
    '3. NEW: Add a triple namespace listener': function(test) {
      var i = iterations;

      console.time('test3');

      while(i--) {
        emitter.on('single.double.triple', function() {});
      }

      console.timeEnd('test3');

      test.done();
    },
    '4. NEW: Add a quadruple namespace listener': function(test) {
      var i = iterations;

      console.time('test4');

      while(i--) {
        emitter.on('single.double.triple.quadruple', function() {});
      }

      console.timeEnd('test4');

      test.done();
    }
  };


  root.testAddListenerOnOld = {
    '1. NEW: Add a single namespace listener': function(test) {
      var i = iterations;

      console.time('test1');

      while(i--) {
        emitter___old.on('single', function() {});
      }

      console.timeEnd('test1');

      test.done();
    },
    '2. NEW: Add a double namespace listener': function(test) {
      var i = iterations;

      console.time('test2');

      while(i--) {
        emitter___old.on('single.double', function() {});
      }

      console.timeEnd('test2');

      test.done();
    },
    '3. NEW: Add a triple namespace listener': function(test) {
      var i = iterations;

      console.time('test3');

      while(i--) {
        emitter___old.on('single.double.triple', function() {});
      }

      console.timeEnd('test3');

      test.done();
    },
    '4. NEW: Add a quadruple namespace listener': function(test) {
      var i = iterations;

      console.time('test4');

      while(i--) {
        emitter___old.on('single.double.triple.quadruple', function() {});
      }

      console.timeEnd('test4');

      test.done();
    }
  };

}(typeof exports === 'undefined' ? window : exports);
