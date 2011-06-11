
this.basicEvents = {
  '1. A listener should react to an event when the event is emitted.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2;
    
    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test1');

    test.expect(1);
    test.done();

  },
  '2. A listener should react with a parameter to an event when the event is emitted.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test2', function (event, value1) {
      test.ok(true, 'The event was raised');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });
    
    emitter.emit('test2', 1);

    test.expect(2);
    test.done();

  },  
  '3. A listener should react with multiple parameters to an event when the event is emitted.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test3', function (event, value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value2 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value3 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test3', 1, 2, 3);

    test.expect(5);
    test.done();

  },
  '4. A listener should react with multiple parameters to an event when the event name multiple times.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test4', function (event, value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
      test.ok(value1 === 1 || value1 === 4, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value2 === 2 || value2 === 5, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value3 === 3 || value3 === 6, 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test4', 1, 2, 3);
    emitter.emit('test4', 4, 5, 6);

    test.expect(10);
    test.done();

  },
  
  '5. An event can be namespaced.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test5.ns1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test5.ns1');

    test.expect(1);
    test.done();

  },
  '6. An event can be namespaced and accept values.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test6.ns1', function (event, value1) {
      test.ok(true, 'The event was raised');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });

    emitter.emit('test6.ns1', 1);

    test.expect(2);
    test.done();    

  },
  '7. A namespaced event can be raised multiple times and accept values.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

     emitter.on('test7.ns1', function (event, value1, value2, value3) {
       test.ok(true, 'The event was raised');
       test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
       test.ok(value1 === 1 || value1 === 4, 'The event was raised with the value `' + value1 + '`.');
       test.ok(value2 === 2 || value2 === 5, 'The event was raised with the value `' + value2 + '`.');
       test.ok(value3 === 3 || value3 === 6, 'The event was raised with the value `' + value3 + '`.');            
     });

     emitter.emit('test7.ns1', 1, 2, 3);
     emitter.emit('test7.ns1', 4, 5, 6);

     test.expect(10);
     test.done();
  },    
  '8. A listener should support wild cards.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test8.*', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test8.ns1');

    test.expect(1);
    test.done();

  },
  '9. Emitting an event should support wildcards.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test9.ns1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test9.*');

    test.expect(1);
    test.done();

  },
  '10. A listener should support complex wild cards.': function (test) {
    
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test10.*.foo', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test10.ns1.foo');

    test.expect(1);
    test.done();    

  },
  '11. Emitting an event should support complex wildcards.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test11.ns1.foo', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test11.*.foo');

    test.expect(1);
    test.done();    

  },
  '12. Emitting an event should support complex wildcards multiple times, a valid listener should accept values.': function (test) {
    
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test12.ns1.ns2', function (event, value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
      test.ok(value1 === 1 || value1 === 4, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value2 === 2 || value2 === 5, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value3 === 3 || value3 === 6, 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test12.*.ns2', 1, 2, 3);
    emitter.emit('test12.*.ns2', 4, 5, 6);

    test.expect(10);
    test.done();
    
  },
  '13. List all the listeners for a particular event.': function(test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }    

    var emitter = new EventEmitter2();

    emitter.on('test13', function (event) {
      console.log('1');
    });

    emitter.on('test13', function (event) {
      console.log('2');
    });    

    var listeners = emitter.listeners('test13');

    test.ok(listeners.length === 2, 'The event `test13` should have 2 listeners');
    test.done();

  },
   '14. A listener should support total wild card.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('*', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test14');
    emitter.emit('test14.ns1');
    emitter.emit('test14.ns1.ns2');

    test.expect(3);
    test.done();

  },
  '15. A listener should support complex total wild card.': function (test) {

    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('*', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test14.*');
    emitter.emit('test14.*.ns2')
    emitter.emit('*');

    test.expect(3);
    test.done();

  },
  '15. Should be able to fire with wildcard start.' : function (test) {
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../EventEmitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2();

    emitter.on('test15', function () {
      test.ok(true, 'The event test15 was raised');
    });
    emitter.on('test15.ns1', function () {
      test.ok(false, 'a dead event was raised!');
    });

    emitter.emit('*');
    emitter.emit('*.ns1');

    test.expect(2);
    test.done();
  }

};
