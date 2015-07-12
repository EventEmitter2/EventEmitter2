var simpleEvents = require('nodeunit').testCase;
var Reventer = require('../../lib/Reventer');

module.exports = simpleEvents({

  '1. A listener added with `once` should only listen once and then be removed.': function (test) {

    var emitter = new Reventer();

    emitter.once('test1', function () {
      test.ok(true, 'The event was raised once');
    });

    emitter.emit('test1');
    emitter.emit('test1');

    test.expect(1);
    test.done();

  },
  '2. A listener with a TTL of 4 should only listen 4 times.': function (test) {

    var emitter = new Reventer();

    emitter.many('test1', 4, function () {
      test.ok(true, 'The event was raised 4 times.');
    });

    emitter.emit('test1', 1);
    emitter.emit('test1', 2);
    emitter.emit('test1', 3);
    emitter.emit('test1', 4);
    emitter.emit('test1', 5);

    test.expect(4);
    test.done();

  },
  '3. A listener with a TTL of 4 should only listen 4 times and pass parameters.': function (test) {

    var emitter = new Reventer();

    emitter.many('test1', 4, function (value1, value2, value3) {
      test.ok(typeof value1 !== 'undefined', 'got value 1');
      test.ok(typeof value2 !== 'undefined', 'got value 2');
      test.ok(typeof value3 !== 'undefined', 'got value 3');
    });

    emitter.emit('test1', 1, 'A', false);
    emitter.emit('test1', 2, 'A', false);
    emitter.emit('test1', 3, 'A', false);
    emitter.emit('test1', 4, 'A', false);
    emitter.emit('test1', 5, 'A', false);

    test.done();

  },
  '4. Remove an event listener by signature.': function (test) {

    var emitter = new Reventer();
    var count = 0;

    function f1(event) {
      "event A";
      test.ok(true, 'The event was raised less than 3 times.');
    }

    emitter.on('test1', f1);

    function f2(event) {
      "event B";
      test.ok(true, 'The event was raised less than 3 times.');
    }

    emitter.on('test1', f2);

    function f3(event) {
      "event C";
      test.ok(true, 'The event was raised less than 3 times.');
    }

    emitter.on('test1', f3);

    emitter.removeListener('test1', f2);

    emitter.emit('test1');

    test.expect(2);
    test.done();

  },
  '5. `removeListener` and `once`': function(test) {

    var emitter = new Reventer();
    var functionA = function() { test.ok(true, 'Event was fired'); };

    emitter.once('testA', functionA);
    emitter.removeListener('testA', functionA);

    emitter.emit('testA');

    test.expect(0);
    test.done();
  }

});
