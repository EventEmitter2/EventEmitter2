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

  '1. Test event names function.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo', () => {});
    emitter.on('bar', () => {});

    var eventNames = emitter.eventNames();
    eventNames.sort();
    test.equal(eventNames.length, 2);
    test.equal(eventNames[0],'bar');
    test.equal(eventNames[1],'foo');
    test.done();
  }
});
