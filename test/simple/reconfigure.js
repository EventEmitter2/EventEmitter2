var simpleEvents = require('nodeunit').testCase;
var EventEmitter3 = require('../../lib/EventEmitter3');

module.exports = simpleEvents({

  'reconfigure1. initialize, removeAllListeners' : function (test) {

    var emitter,
        config = {
          wildcard: true, // should the event emitter use wildcards.
          delimiter: '::::', // the delimiter used to segment namespaces, defaults to `.`.
          maxListeners: 20 // the max number of listeners that can be assigned to an event, defaults to 10.
      };

    emitter = new EventEmitter3(config);

    emitter.removeAllListeners();

    test.equal(emitter._events.maxListeners, config.maxListeners, 'should be ' + config.maxListeners);

    test.equal(emitter._conf.maxListeners, config.maxListeners, 'should be ' + config.maxListeners);
    test.equal(emitter._conf.delimiter, config.delimiter, 'should be ' + config.delimiter);
    test.equal(emitter._conf.wildcard, config.wildcard, 'should be ' + config.wildcard);

    test.expect(4);
    test.done();
  },

  'reconfigure1. setMaxListeners, removeAllListeners' : function (test) {
    var emitter,
        amount = 99;

    emitter = new EventEmitter3();

    emitter.setMaxListeners(amount);

    emitter.removeAllListeners();

    test.equal(emitter._events.maxListeners, amount, 'should be ' + amount);

    test.equal(emitter._conf.maxListeners, amount, 'should be ' + amount);

    test.expect(2);
    test.done();
  }

});
