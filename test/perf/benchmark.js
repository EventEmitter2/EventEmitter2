var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var EventEmitter2 = require('events').EventEmitter;
var emitter2 = new EventEmitter2();

var EventEmitter3 = require('../../lib/eventemitter3');
var emitter3 = new EventEmitter3();

suite

  .add('EventEmitterHeatUp', function() {

      emitter2.on('test2', function () { 1==1; });
      emitter2.emit('test2');
      emitter2.removeAllListeners('test2');

  })
  .add('EventEmitter', function() {

    emitter.on('test1', function () { 1==1; });
    emitter.emit('test1');
    emitter.removeAllListeners('test1');

  })
  .add('EventEmitter3', function() {

    emitter3.on('test3', function () { 1==1; });
    emitter3.emit('test3');
    emitter3.removeAllListeners('test3');

  })

  .add('EventEmitter3 (wild)', function() {

    emitter3.on('test3.foo', function () { 1==1; });
    emitter3.emit('test3.foo');
    emitter3.removeAllListeners('test3.foo');

  })

  .on('cycle', function(event, bench) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest is ' + this.filter('fastest').pluck('name'));
  })

  .run(true);
