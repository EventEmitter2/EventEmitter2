
var EventEmitter2 = require('../../lib/em').EventEmitter2;
var emitter = new EventEmitter2;

var totalIterations = 100000;
var iterations = totalIterations;
var names = [];

while(iterations--) {
  names[iterations] = Math.pow(2*10, Math.random()).toString().replace('.', '');
}

iterations = totalIterations;

console.time('test');

while (iterations--) {
  emitter.on(names[iterations], function () { 1==1; });
}

iterations = totalIterations;

while (iterations--) {
  emitter.emit(names[iterations]);
}

console.timeEnd('test');