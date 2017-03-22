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

  '1. Add a listener before another one on a single event.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    var raised = false;
    var second = function () {
      test.ok(raised, 'The event was raised in incorrect order');
      test.done();
    };
    emitter.on('test1', second);

    var first = function () {
      test.ok(!raised, 'The event was raised in incorrect order');
      raised = true;
    };
    emitter.prependListener('test1', first);

    test.equal(emitter.listeners('test1').length, 2);
    test.equal(emitter.listeners('test1')[0], first);
    test.equal(emitter.listeners('test1')[1], second);
    emitter.emit('test1');


  },
  '2. prepend listener for any event' : function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    var raised = false;
    var second = function () {
      test.ok(raised, 'The event was raised in incorrect order');
      test.done();
    };
    emitter.onAny(second);

    var first = function () {
      test.ok(!raised, 'The event was raised in incorrect order');
      raised = true;
    };
    emitter.prependAny(first);

    emitter.emit('random');
  
  }
});
