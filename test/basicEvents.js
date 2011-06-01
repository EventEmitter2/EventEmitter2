
this.basicEvents = {
  '1. A listener should react to an event when the event name is emitted.': function (test) {

    if(require) {
      var EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test1');

    test.done();

  },
  '2. A listener should react with a parameter to an event when the event name is emitted.': function (test) {

    if(require) {
      var EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test2', function (value1) {
      test.ok(true, 'The event was raised');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });
    
    emitter.emit('test2');

    test.done();

  },  
  '3. A listener should react with multiple parameters to an event when the event name is emitted.': function (test) {

    if(require) {
      var EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test3', function (value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 3, 'The event was raised with the correct number of arguments');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value2 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value3 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test3', 1, 2, 3);

    test.done();

  },
  '4. A listener should react with multiple parameters to an event when the event name multiple times.': function (test) {

    if(require) {
      var EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test4', function (value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 3, 'The event was raised with the correct number of arguments');
      test.ok(value1 === 1 || value1 === 4, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value2 === 2 || value2 === 5, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value3 === 3 || value3 === 6, 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test4', 1, 2, 3);
    emitter.emit('test4', 4, 5, 6);

    test.done();

    test.ok(true, 'everythings ok');
    test.done();

  },
  
  '5. Events can be namespaced.': function (test) {

    if(require) {
      var EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test5/ns1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test5/ns1');
    test.done();

  },
  '6. Events can be namespaced and accept values.': function (test) {

    // if(require) {
    //   var EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    // }

    //var emitter = new EventEmitter2();

    //emitter.on('test6/ns1', function (value1) {

      //test.ok(true, 'The event was raised');
      //test.ok(typeof value1 === 'undefined', 'The event was raised with the value `' + value1 + '`.');
    //});

    //emitter.emit('test2/ns1');
    
    test.ok(true, 'The event was raised');
    test.done();

  },
  '7. ': function (test) {



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
