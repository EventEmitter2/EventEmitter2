var simpleEvents= require('nodeunit').testCase;

var file = '../../lib/em';

/////helper///////
function setHelper (emitter, test, testName){
  var eventNames = [
    testName, 
    testName + '.*', 
    testName + '.ns1', 
    testName + '.ns1.ns2', 
    testName + '.ns2.*'
  ];

  for (var i = 0; i < eventNames.length; i++) {
    emitter.on(eventNames[i], function () { 
        test.ok(true, eventNames[i] + 'has fired');
    });
  }

  return eventNames;
};

module.exports = simpleEvents1({

  setUp: function (callback) {
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require(file).EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    this.emitter = new EventEmitter2();
    callback();
  },

  tearDown: function (callback) {
    //clean up?
    callback();
  },

  '1. A listener should react to an event when the event is emitted.': function (test) {
    var emitter = this.emitter;

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test1');

    test.expect(1);
    test.done();

  },
  '2. A listener should react with a parameter to an event when the event is emitted.': function (test) {
    var emitter = this.emitter;
    emitter.on('test2', function (event, value1) {

      test.ok(true, 'The event was raised');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });
    
    emitter.emit('test2', 1);

    test.expect(2);
    test.done();

  },  
  '3. A listener should react with multiple parameters to an event when the event is emitted.': function (test) {

    var emitter = this.emitter;

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

    var emitter = this.emitter;

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

  '5. should be able to emit on multiple copies of an event listeners': function (test) {
    var emitter = this.emitter;

    emitter.on('test5', function a() {
      test.ok(true,'emitted test5');
    });
    emitter.on('test5', function b() {
      test.ok(true,'emitted test5');
    });
    emitter.on('test5', function c() {
      test.ok(true,'emitted test5');
    });
    emitter.on('test5', function d() {
      test.ok(true,'emitted test5');
    });

    emitter.emit('test5');

    test.expect(4);
    test.done();
    
  },
  '6. List all the listeners for a particular event.': function(test) {

    var emitter = this.emitter;

    emitter.on('test13', function (event) {
      test.ok(true,'raised one');
    });

    emitter.on('test13', function (event) {
      test.ok(true,'raised two');
    });

    var listeners = emitter.listeners('test13');

    test.ok(listeners.length === 2, 'The event `test13` should have 2 listeners');
    test.expect(1);
    test.done();
  },

  '7. Should fail if delimiter is used to start or end event name.' : function (test) {
    var emitter = this.emitter;

    try {
      emitter.on('.ns4', function () {

        test.ok(false, 'The event .ns4 was raised');
      });

      emitter.emit('.ns4');
    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }
    
    try {
      emitter.on('ns4.', function () {
        test.ok(false, 'The event .ns4 was raised');
      });

      emitter.emit('ns4.');
    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }

    try {

      emitter.on('.ns4.', function () {
        test.ok(false, 'The event .ns4. was raised');
      });

      emitter.emit('.ns4.');
    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }
    
    try {

      emitter.on('ns4.ns2..ns3', function () {
        test.ok(false, 'The event .ns4 was raised');
      });
      emitter.emit('ns4.ns2..ns3');

    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }
    
    try {
      emitter.emit('some..bad');
    }
    catch (ex) {
      test.ok(true, 'error was raised');
    }

    try {
      emitter.on('some..bad', function () {
        test.ok(false, 'a bad event was raised');
      });
    }
    catch (ex){
      test.ok(true,'error was raised');
    }

    test.expect(5);
    test.done();
  },

  '8. Should provide case sensitive option.' : function (test) {
    var emitter  = this.emitter;

    emitter.on('test18', function () {
      test.ok(false, 'The event test18 was raised');
    });
    emitter.on('test18.ns1', function () {
      test.ok(false, 'The event test18.ns1 was raised');
    });

    emitter.emit('Test18');

    test.expect(0);
    test.done();
  },

  '9. should be able to removeListeners' : function (test) {

    var emitter = this.emitter;
    var functionA = function a() { test.ok(true, 'someFunc was raised') };
    var functionB = function b() { test.ok(true, 'someFunc was raised') };
    
    emitter.on('test21', functionA);

    emitter.emit('test21'); //1
    
    test.equal(emitter.listeners('test21').length, 1, 'there should be 1 listener');

    emitter.removeListener('test21', functionA);

    listeners = emitter.listeners('test21');
    
    test.equal(emitter.listeners('test21').length, 0, 'there should be 0 listener (empty array)'); //1
    
    // should be able to add more listeners after removing

    emitter.on('test21', functionA);
    emitter.on('test21', functionB);

    test.equal(emitter.listeners('test21').length, 2, 'there should be 2 listeners'); //1
    
    emitter.emit('test21'); //2
    
    test.expect(6);
    test.done();
  },

  '10. should be able to remove all listeners' : function (test) {

    var emitter = this.emitter;

    emitter.on('test22', function () {test.ok(true, 'emitted')});
    emitter.emit('test22'); //1

    var listeners = emitter.listeners('test22');
    test.equal(listeners.length, 1, 'there should be 1 listener'); //1

    emitter.removeAllListeners('test22');
    
    listeners = emitter.listeners('test22');
    
    test.equal(listeners.length, 0, 'there should be 0 listener'); //1

    test.expect(3);
    test.done();
  },

  '23. should be able to listen on any event' : function (test) {

    var emitter = this.emitter,
        someData = {
          key : 'hello',
          bar : 'foo',
          'baz' : 5
        };
        fn = function (tag, data) {
          if (tag !== 'addListener') {
            test.equals(tag, 'test23ns5ns5', 'emitted tag, and raised tag should match');
            test.equals(someData,data, 'data should be passed up');
            test.ok(true, 'something happened somewhere');
          }
        };

    emitter.onAny(fn);
    emitter.emit('test23ns5ns5', someData); //3
    emitter.unAny(fn);
    emitter.emit('test21'); //0
    emitter.onAny(fn);
    emitter.onAny(fn);
    emitter.emit('test23ns5ns5', someData); //6
    emitter.unAny();

    test.expect(9);
    test.done();

  },

  '24. should be able to fire once and done' : function (test) {
    var emitter = this.emitter;
    
    emitter.once('test24once', function () {
        test.ok(true, 'fired once');
    });

    emitter.emit('test24once');
    emitter.emit('test24once');

    test.expect(1);
    test.done();
  },

  '25. should be able to fire many and done' : function (test) {

    var emitter = this.emitter;
    
    emitter.many('test25many', 5, function () {
        test.ok(true, 'test25many pewpew');
    });

    for (var i= 0; i < 5; i++) {
      emitter.emit('test25many'); //5
    }
    emitter.emit('test25many'); //0

    test.expect(5);
    test.done();
  },

  '28. should raise errors, if error is emitted and not caught' : function (test) {
    var emitter = this.emitter,
        error   = new Error('Something Funny Happened');

    try {
      emitter.emit('error');
    }
    catch (ex) {
      test.ok(ex instanceof Error, 'should be an Error');
    }
  
    try {
      emitter.emit('error', error);
    }
    catch (ex) {
      test.equal(error, ex, 'should have passed up the argument');
    }
  
    emitter.on('error', function (event, err) {
      test.ok(true, 'error event was raised');
      test.equal(err, error, 'of the error');
    });
  
    emitter.emit('error',error);
  
    test.expect(4);
    test.done();
  },

  '33. should complain when too many are registerd' : function (test) {
    var emitter = this.emitter;

    emitter.on('maxListeners', function () {
      test.ok(true, 'maxListeners fired');
    });

    for (var i = 0; i < 11 ; i++){
      emitter.on('test33', function () {
        test.ok(false, 'event was raised');
      });
    }

    var listeners = emitter.listeners('test33');
    test.equal(listeners.length, 10, '10 listeners in total');

    test.expect(1);
    test.done();
  },

  '34. should be able to initiate and add infinite for 0 or less maxListeners' : function (test) {
    var emitter = this.emitter;

    emitter.on('maxListeners', function () {
      test.ok(true, 'maxListeners fired');
    });

    emitter.setMaxListeners(20);

    for (var i = 0; i < 11 ; i++){
      emitter.on('test34', function () {
        test.ok(false, 'event was raised');
      });
    }

    var listeners = emitter.listeners('test34');
    test.equal(listeners.length, 11, '11 listeners in total');

    test.expect(1);
    test.done();
  },

});
