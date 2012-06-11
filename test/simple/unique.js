var uniqueEvents = require('nodeunit').testCase;

var file = '../../lib/eventemitter2';

module.exports = uniqueEvents({

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

  '1. Trigger unique event.': function (test) {
	var emitter = this.emitter;

	function functionA() { test.ok(true, 'The event was raised'); }

	emitter.unique('test2');

	emitter.on('test2', functionA);

	test.expect(1);
	test.done();
  },
  
  '2. Trigger unique event with values.': function (test) {
	var emitter = this.emitter;

	function functionA(e) { test.ok('value', e.value); }

	emitter.unique('test2',{value : 'value'});

	emitter.on('test2', functionA);

	test.expect(1);
	test.done();
  },
  
      
});