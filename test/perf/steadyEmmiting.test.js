
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

// basic emitter
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var EventEmitter2 = require('../../lib/eventemitter2').EventEmitter2;


// Emitter2 variations
var emitter2 = new EventEmitter2();
var emitter3 = new EventEmitter2();
var emitter4 = new EventEmitter2({wildcard:true});
var emitter5 = new EventEmitter2({wildcard:true});
var emitter6 = new EventEmitter2();
var emitter7 = new EventEmitter2({wildcard:true});

var t;

emitter.on('test1', function () { t=1; });
emitter.on('test1', function () { t=1; });
emitter.on('test2.foo', function () { t=1; });

emitter2.on('test1', function () { t=1; });
emitter2.on('test2', function () { t=1; });
emitter2.on('test2.foo', function () { t=1; });

emitter3.on('test1', function () { t=1; });
emitter3.on('test2', function () { t=1; });
emitter3.on('test2.foo', function () { t=1; });
emitter3.onAny( function () { t=1; });

emitter4.on('test1', function () { t=1; });
emitter4.on('test2', function () { t=1; });
emitter4.on('test2.foo', function () { t=1; });

emitter5.on('test1', function () { t=1; });
emitter5.on('test2', function () { t=1; });
emitter5.on('test2.foo', function () { t=1; });
emitter5.onAny( function () { t=1; });

emitter6.on('test1', function () { t=1; });
emitter6.on('test1', function () { t=1; });
emitter6.on('test1', function () { t=1; });
emitter6.on('test1', function () { t=1; });
emitter6.on('test2', function () { t=1; });
emitter6.on('test4', function () { t=1; });
emitter6.on('test5', function () { t=1; });
emitter6.on('test6', function () { t=1; });
emitter6.on('test7', function () { t=1; });
emitter6.onAny( function () { t=1; });
emitter6.onAny( function () { t=1; });
emitter6.onAny( function () { t=1; });
emitter6.onAny( function () { t=1; });

emitter7.on('test1.one', function () { t=1; });
emitter7.on('*.one', function () { t=1; });
emitter7.on('test1.one', function () { t=1; });
emitter7.on('test1.two', function () { t=1; });
emitter7.on('*.two', function () { t=1; });
emitter7.on('*.*', function () { t=1; });
emitter7.on('test1.*', function () { t=1; });
emitter7.on('**', function () { t=1; });
emitter7.on('*.*', function () { t=1; });
emitter7.onAny( function () { t=1; });
emitter7.onAny( function () { t=1; });
emitter7.onAny( function () { t=1; });
emitter7.onAny( function () { t=1; });

suite
  .add('Test HeatUp', function() {
    emitter.emit('test1');
  })
  .add('All at once', function () {
    for (var emmiter in [emitter2,emitter3,emitter4,emitter5,emitter6]) {
      emitter.emit('test1');
      emitter.emit('test1',1);
      emitter.emit('test1',1,2);
      emitter.emit('test1',1,2,3);
    }
    emitter7.emit('test1.one');
    emitter7.emit('test1.one',1);
    emitter7.emit('test1.one',1,2);
    emitter7.emit('test1.one',1,2,3);
  })
  .add('EventEmitter', function() {
    emitter.emit('test1');
  })
  .add('EventEmitter 1', function() {
    emitter.emit('test1',1);
  })
  .add('EventEmitter 1 2', function() {
	  emitter.emit('test1',1,2);
  })
  .add('EventEmitter 1 2 3', function() {
    emitter.emit('test1',1,2,3);
  })
  .add('EventEmitter2', function() {
    emitter2.emit('test1');
  })
  .add('EventEmitter2 1', function() {
    emitter2.emit('test1',1);
  })
  .add('EventEmitter2 1 2', function() {
    emitter2.emit('test1',1,2);
  })
  .add('EventEmitter2 1 2 3', function() {
    emitter2.emit('test1',1,2,3);
  })
 .add('EventEmitter2 +any', function() {
    emitter3.emit('test1',1);
  })
  .add('EventEmitter2 +any 1', function() {
    emitter3.emit('test1',1);
  })
  .add('EventEmitter2 +any 1 2', function() {
    emitter3.emit('test1',1,2);
  })
  .add('EventEmitter2 +any 1 2 3', function() {
    emitter3.emit('test1',1,2,3);
  })
  .add('EventEmitter2 wild', function() {
    emitter4.emit('test1');
  })
  .add('EventEmitter2 wild 1', function() {
    emitter4.emit('test1',1);
  })
  .add('EventEmitter2 wild 1 2', function() {
    emitter4.emit('test1',1,2);
  })
  .add('EventEmitter2 wild 1 2 3', function() {
    emitter4.emit('test1',1,2,3);
  })
  .add('EventEmitter2 wild +any', function() {
    emitter5.emit('test1');
  })
  .add('EventEmitter2 wild +any 1', function() {
    emitter5.emit('test1',1);
  })
  .add('EventEmitter2 wild +any 1 2', function() {
    emitter5.emit('test1',1,2);
  })
  .add('EventEmitter2 wild +any 1 2 3', function() {
    emitter5.emit('test1',1,2,3);
  })
  .add('EventEmitter2 complex', function() {
    emitter6.emit('test1');
  })
  .add('EventEmitter2 complex 1', function() {
    emitter6.emit('test1',1);
  })
  .add('EventEmitter2 complex 1 2', function() {
    emitter6.emit('test1',1,2);
  })
  .add('EventEmitter2 complex 1 2 3', function() {
    emitter6.emit('test1',1,2,3);
  })
  .add('EventEmitter2 wild complex', function() {
    emitter7.emit('test1.one');
  })
  .add('EventEmitter2 wild complex 1', function() {
    emitter7.emit('test1.one',1);
  })
  .add('EventEmitter2 wild complex 1 2', function() {
    emitter7.emit('test1.one',1,2);
  })
  .add('EventEmitter2 wild complex 1 2 3', function() {
    emitter7.emit('test1.one',1,2,3);
  })
  .on('cycle', function(event, bench) {
    console.log(String(event.target));
  })
  .run(true);
