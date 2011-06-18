var EventEmitter = require('../eventemitter2').EventEmitter2;

 var emitter = new EventEmitter();

 emitter.on('.ns4', function () {
   test.ok(false, 'The event .ns4 was raised');
 });