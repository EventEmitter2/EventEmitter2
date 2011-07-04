
this.timesToLive = {
  '1. A listener added with `once` should only listen once and then be removed.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2, count = 1;
    
    emitter.once('test1', function () {
      test.ok(count===1, 'The event was raised once');
      count++;
    });

    emitter.emit('test1');
    emitter.emit('test1');

    test.done();

  },
  '2. A listener with a TTL of 4 should only listen 4 times.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2, count = 0;
    
    emitter.on('test1', function (event, value1) {
      test.ok(count <= 4, 'The event was raised 4 times.');
      count++;
    }, 4);

    emitter.emit('test1', 1);
    emitter.emit('test1', 2);
    emitter.emit('test1', 3);
    emitter.emit('test1', 4);
    emitter.emit('test1', 5);

    test.done();

  },
  '3. A listener with a TTL of 4 should only listen 4 times and pass parameters.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2, count = 0;

    emitter.on('test1', function (event, value1, value2, value3) {
      test.ok(typeof value1 !== 'undefined', 'got value 1');
      test.ok(typeof value2 !== 'undefined', 'got value 2');
      test.ok(typeof value3 !== 'undefined', 'got value 3');
      test.ok(count <= 4, 'The event was raised 4 times.');
      count++;
    }, 4);

    emitter.emit('test1', 1, 'A', false);
    emitter.emit('test1', 2, 'A', false);
    emitter.emit('test1', 3, 'A', false);
    emitter.emit('test1', 4, 'A', false);
    emitter.emit('test1', 5, 'A', false);

    test.done();

  },
  '3. Remove an event listener by signature.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2, count = 0;

    function f1(event) {
      "event A";
      test.ok(count < 3, 'The event was raised less than 3 times.');
      count++;
    }

    emitter.on('test1', f1);
    
    function f2(event) {
      "event B";
      test.ok(count < 3, 'The event was raised less than 3 times.');
      count++;      
    }    
    
    emitter.on('test1', f2);

    function f3(event) {
      "event C";
      test.ok(count < 3, 'The event was raised less than 3 times.');
      count++;      
    }

    emitter.on('test1', f3);

    emitter.removeListener('test1', f2);

    emitter.emit('test1');

    test.done();

  },
  '4. `removeListener` and `once`': function(test) {
    var EventEmitter2;

    if (typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2,
        count = 0,
        b = function() {
          count++;
        };

    emitter.once('a', b);
    emitter.removeListener('a', b);

    emitter.emit('a');

    test.ok(count === 0, 'Removed listener should not be fired');
    test.done();
  }
  
};
