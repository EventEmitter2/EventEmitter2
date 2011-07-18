
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite({
  options: {
    minSamples: 1000
  }
});

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

var EventEmitter2 = require('../../lib/em').EventEmitter2;
var emitter2 = new EventEmitter2;


var EventEmitter3 = require('events').EventEmitter;
var emitter3 = new EventEmitter3;

// add tests
suite

  .add('EventEmitterHeatUp', function() {

      emitter3.on('test3', function () { 1==1; });
      emitter3.emit('test3');
      emitter3.removeAllListeners('test3');

  })
  .add('EventEmitter2', function() {

      emitter2.on('test2', function () { 1==1; });
      emitter2.emit('test2');
      emitter2.removeAllListeners('test2');

  })
  .add('EventEmitter', function() {

      emitter.on('test1', function () { 1==1; });
      emitter.emit('test1');
      emitter.removeAllListeners('test1');
  })

// add listeners
.on('cycle', function(event, bench) {
  console.log(String(bench));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run(true);

