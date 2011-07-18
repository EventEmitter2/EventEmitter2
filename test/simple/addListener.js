var simpleEvents = require('nodeunit').testCase;

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

module.exports = simpleEvents({

  setUp: function (callback) {
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require(file).EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    this.emitter = new EventEmitter2({ verbose: true });
    callback();
  },

  tearDown: function (callback) {
    //clean up?
    callback();
  },

  '1. Add a single listener on a single event.': function (test) {
    
    var emitter = this.emitter;

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    test.expect(0);
    test.done();

  },
  '2. Add two listeners on a single event.': function (test) {
    
    var emitter = this.emitter;

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.on('test2', function () {
      test.ok(true, 'The event was raised');
    });

    test.expect(0);
    test.done();

  }

});
