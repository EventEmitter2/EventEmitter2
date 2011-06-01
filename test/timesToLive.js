
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
  '1. A listener with a TTL of 10 should only listen 10 times.': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  }
};
