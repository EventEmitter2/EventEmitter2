this.benchmark1 = {
  '1. Set up a single listener and emit 10,000 times using EventEmitter2.': function (test) {

    var EventEmitter2, iterations;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2(), iterations = 10000;

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    //console.time('test1');

    while(iterations--) {
      emitter.emit('test1');
    }

    test.ok(true, 'finished tests');
    //console.timeEnd('test1');

    test.done();

  }
};

this.benchmark2 = {
 '2. Set up a single listener and emit 10,000 times using the Node.js EventEmitter.': function (test) {

    var EventEmitter, iterations;

    if(typeof require !== 'undefined') {
      EventEmitter = require('events').EventEmitter;
    }
    else {
      EventEmitter = window.EventEmitter;
    }    
    

    var emitter = new EventEmitter(), iterations = 10000;;

    emitter.on('test2', function () {
      test.ok(true, 'The event was raised');
    });

    //console.time('test2');

    while(iterations--) {
      emitter.emit('test2');
    }

    test.ok(true, 'finished tests');
    //console.timeEnd('test2');

    test.done();

  }
};

this.benchmark3 = {
  '3. A listener should fire a callback with multiple parameters for an event when the event name is emitted using EventEmitter2.': function (test) {

    var EventEmitter2, iterations;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2(), iterations = 10000;;

    emitter.on('test3', function (event, value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value2 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value3 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });

    //console.time('test3');

    while(iterations--) {
      emitter.emit('test3', 1, 2, 3);
    }

    test.ok(true, 'finished tests');
    //console.timeEnd('test3');

    test.done();

  }
};

this.benchmark4 = {
  '4. A listener should fire a callback with multiple parameters for an event when the event name is emitted using Node.js EventEmitter.': function (test) {

    var EventEmitter, iterations;

    if(typeof require !== 'undefined') {
      EventEmitter = require('events').EventEmitter;
    }
    else {
      EventEmitter = window.EventEmitter;
    }

    var emitter = new EventEmitter(), iterations = 10000;

    emitter.on('test4', function (value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 3, 'The event was raised with the correct number of arguments');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value2 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value3 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });

    //console.time('test4');

    while(iterations--) {
      emitter.emit('test4', 1, 2, 3);
    }

    test.ok(true, 'finished tests');
    //console.timeEnd('test4');

    test.done();

  }
};
