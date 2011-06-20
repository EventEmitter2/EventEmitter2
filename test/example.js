var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    EventEmitter2 = require('./lib/eventemitter2').EventEmitter2,
    EventEmitter2___old = require('./lib/eventemitter2___old').EventEmitter2___old;


// This works!!!
var Test1 = function(){
  this.on('test', function(){console.log('Test1 works')});
  this.emit('test');
};
util.inherits(Test1, EventEmitter);
new Test1();


// This works!!!
var Test2 = function(){
  this.on('test', function(){console.log('Test2 works')});
  this.emit('test');
};
util.inherits(Test2, EventEmitter2);
new Test2();


// This is not going to work...
var Test3 = function(){
  this.on('test', function(){console.log('Test3 works')});
  this.emit('test');
};
util.inherits(Test3, EventEmitter2___old);
new Test3();
