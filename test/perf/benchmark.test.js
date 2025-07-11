var os= require('os');


var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

var EventEmitter2 = require('../../lib/eventemitter2').EventEmitter2;
var emitter2 = new EventEmitter2;

var wildcardEmitter = new EventEmitter2({
  wildcard: true
});

var wildcardEmitter2 = new EventEmitter2({
  wildcard: true
});

wildcardEmitter2.on('test2.foo', function () { 1==1; });
wildcardEmitter2.on('test2', function () { 1==1; });

var EventEmitterB = require('events').EventEmitter;
var emitterB = new EventEmitterB;

var EventEmitter3 = require('eventemitter3').EventEmitter;
var emitter3 = new EventEmitter3;

console.log('Platform: ' + [
  process.platform,
  process.arch,
  Math.round((os.totalmem() / (1024 * 1024))) + 'MB'
].join(', '));

console.log('Node version: ' + process.version);
var cpus= {};
os.cpus().forEach(function(cpu){
  var id= [cpu.model.trim(), ' @ ', cpu.speed, 'MHz'].join('');
  if(!cpus[id]){
    cpus[id]= 1;
  }else{
    cpus[id]++;
  }
});

console.log('CPU:' + Object.entries(cpus).map(function(data){
  return [' ', data[1], ' x ', data[0]].join('');
}).join('\n'));

console.log('----------------------------------------------------------------');

    suite

  .add('EventEmitterHeatUp', function() {

      emitterB.on('test3', function () { 1==1; });
      emitterB.emit('test3');
      emitterB.removeAllListeners('test3');

  })
  .add('EventEmitter', function() {

    emitter.on('test1', function () { 1==1; });
    emitter.emit('test1');
    emitter.removeAllListeners('test1');

  })
  .add('EventEmitter2', function() {

    emitter2.on('test2', function () { 1==1; });
    emitter2.emit('test2');
    emitter2.removeAllListeners('test2');

  })

  .add('EventEmitter2 (wild)', function() {

    wildcardEmitter.on('test2.foo', function () { 1==1; });
    wildcardEmitter.emit('test2.foo');
    wildcardEmitter.removeAllListeners('test2.foo');

  })

  .add('EventEmitter2 (wild) using plain events', function() {
    wildcardEmitter.on('test2', function () { 1==1; });
    wildcardEmitter.emit('test2');
    wildcardEmitter.removeAllListeners('test2');
  })

  .add('EventEmitter2 (wild) emitting ns', function() {
    wildcardEmitter2.emit('test2.foo');
  })

  .add('EventEmitter2 (wild) emitting a plain event', function() {
    wildcardEmitter2.emit('test2');
  })

  .add('EventEmitter3', function() {
    emitter3.on('test2', function () { 1==1; });
    emitter3.emit('test2');
    emitter3.removeAllListeners('test2');
  })

  .on('cycle', function(event, bench) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('\nFastest is ' + this.filter('fastest').map('name'));
  })

  .run(true);
