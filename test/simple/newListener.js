
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

  '1. newListener==true  && _events.newListener undefined: prototype.on should emit newListener': function (test) {

    var emitter = new EventEmitter2({ verbose: true, newListener : true });

    emitter.emit = function () { test.ok(true, 'Event "newListener" emited'); }   // hook .emit
    emitter.on('test', function () {});   // should fire .emit newListener
    
    test.expect(1);
    test.done();
  }, 

  '2. newListener==false && _events.newListener defined  : prototype.on should emit newListener': function (test) {

    var emitter = new EventEmitter2({ verbose: true, newListener : false });

    emitter.emit = function () { test.ok(true, 'Event "newListener" emited'); }
    emitter.on('newListener', function() {} );  // define _events.newListener
    emitter.on('test', function () {});   // should fire .emit newListener
    
    test.expect(1);
    test.done();
  },
  
  '3. newListener==false && _events.newListener undefined: prototype.on should not emit newListener': function (test) {

    var emitter = new EventEmitter2({ verbose: true, newListener : false });

    emitter.emit = function () { test.ok(false, 'Event "newListener" should not be emited'); }
    emitter.on('test', function () {});   // should not fire .emit newListener
    
    test.expect();
    test.done();
  },
  
});

