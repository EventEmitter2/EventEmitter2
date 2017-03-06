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
  '1. Receive two results from single event.': function (test) {

    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo',function() {
      return 1;
    });
    emitter.on('foo',function() {
      return 2;
    });

    emitter.emitAsync('foo')
    .then(function(results){
      test.equal(results[0], 1)
      test.equal(results[1], 2)
      test.done();
    });
  },
  '2. Receive two results from single event via promises.': function (test) {
    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo',function(i) {
      return new Promise(function(resolve){
        setTimeout(function(){
          resolve(i+3);
        },50);
      });
    });
    emitter.on('foo',function(i) {
      return new Promise(function(resolve){
        resolve(i+2)
      });
    });
    emitter.on('foo',function(i) {
      return Promise.resolve(i+1);
    });
    emitter.on('foo',function(i) {
      return i+0;
    });
    emitter.on('foo',function(i) {
    });

    emitter.emitAsync('foo',0)
    .then(function(results){
      test.equal(results[0], 3, 'should be 3')
      test.equal(results[1], 2, 'should be 2')
      test.equal(results[2], 1, 'should be 1')
      test.equal(results[3], 0, 'should be 0')
      test.equal(results[4], undefined, 'should be undefined')
      test.done();
    });
  },
  '3. Receive two results from single event with once.': function (test) {
    var emitter = new EventEmitter2({ verbose: true });

    emitter.once('foo',function() {
      return new Promise(function(resolve){
        resolve(1);
      });
    });
    emitter.on('foo',function() {
      return new Promise(function(resolve){
        resolve(2);
      });
    });

    emitter.emitAsync('foo')
    .then(function(results){
      test.equal(results[0], 1)
      test.equal(results[1], 2)
      test.done();
    });
  },
  '4. Return value is always promise': function (test) {
    var emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo', function() {
      return new Promise(function(resolve){
        resolve(1);
      })
    });

    test.ok(emitter.emitAsync('foo') instanceof Promise);
    test.ok(emitter.emitAsync('bar') instanceof Promise);

    emitter.onAny(function() {
      return new Promise(function(resolve){
        resolve(2);
      })
    });
    test.ok(emitter.emitAsync('error') instanceof Promise);

    emitter.emitAsync('error')
    .then(function(results){
      test.equal(results[0], 2)
      test.done();
    });
  },
});