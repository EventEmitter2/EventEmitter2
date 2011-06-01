
this.timesToLive = {
  '1. A listener added with `once` should only listen once and then be removed.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
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
  '1. A listener with a TTL of 4 should only listen 4 times.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2, count = 0;
    
    emitter.on('test1', function (event, value1) {
      console.log(value1)
      test.ok(count <= 4, 'The event was raised ' + value1 + ' times.');
      count++;
    }, 4);

    emitter.emit('test1', 1);
    emitter.emit('test1', 2);
    emitter.emit('test1', 3);
    emitter.emit('test1', 4);
    emitter.emit('test1', 5);

    test.done();

  }
};
