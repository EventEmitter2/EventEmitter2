
this.basicEvents = {
  '1. Set up a single listener and emit 100 times using EventEmitter2.': function (test) {

    if(require) {
      var EventEmitter2 = require('./../EventEmitter').EventEmitter2;
    }

    var emitter = new EventEmitter2(), iterations = 100;

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    console.time('test1');

    while(iterations--) {
      emitter.emit('test1');
    }

    console.timeEnd('test1');

    test.done();

  },
  '2. Set up a single listener and emit 100 times using the Node.js EventEmitter.': function (test) {

    if(require) {
      // use the node.js version
      var EventEmitter2 = require('events').EventEmitter2;
    }

    var emitter = new EventEmitter(), iterations = 100;

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    console.time('test1');

    while(iterations--) {
      emitter.emit('test1');
    }

    console.timeEnd('test1');

    test.done();

  },
  '3. A listener should fire a callback with multiple parameters for an event when the event name is emitted.': function (test) {

    var emitter = new EventEmitter2();

    emitter.on('test3', function (value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 3, 'The event was raised with the correct number of arguments');
      test.ok(typeof value !== 'undefined', 'The event was raised with the values', value1, value2, value3);
    });
    
    emitter.emit('test3', 1, 2, 3);

    test.done();

  },
  '4. ': function (test) {

    // var tests = {
    //  'foo:*': 4,
    //  'foo:*:bar': 2,
    //  'foo:*:*': 3,
    //  'foo:bar:bar': 2
    // }
    // 
    // Object.keys(tests).forEach(function (event) {
    //   var vat = new EventEmitter(),
    //       count = 0;
    // 
    //   vat.on(event, function () {
    //     eyes.inspect(arguments, event);
    //     count++;
    //   });
    // 
    //   eyes.inspect(event, 'Beginning test for');
    // 
    //   vat.emit('foo/box/bar', 1, 2, 3, 4);
    //   vat.emit('foo/bar/*', 5, 6, 7, 8);
    //   vat.emit('foo/*/*', 9, 10, 11, 12);
    //   vat.emit('foo/*');
    // 
    //   assert.equal(count, tests[event]);
    // });


    test.ok(true, 'everythings ok');
    test.done();

  },
  
  '5. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  '6. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  '7. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },    
  '8. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  
  
  '9. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '10. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '11. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '12. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '13. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  
  '14. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '15. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  }    
  

};
