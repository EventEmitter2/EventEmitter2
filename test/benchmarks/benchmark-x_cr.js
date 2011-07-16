var testCase = require('nodeunit').testCase;

module.exports = testCase({

  'Add 10000 listener, emit 300 times' : function (test) {

    var EventEmitter2 = require('events').EventEmitter;
    var emitter = new EventEmitter2;

    var totalIterations = 100000;
    var iterations = totalIterations;
    var names = [];

    while(iterations--) {
      names[iterations] = Math.pow(2*10, Math.random()).toString().replace('.', '');
    }

    iterations = totalIterations;

    console.time('EE_Core');

    while (iterations--) {
      emitter.on(names[iterations], function () { test.ok(true,'emit') });
    }

    iterations = totalIterations;

    while (iterations--) {
      emitter.emit(names[iterations]);
    }
    
    console.timeEnd('EE_Core');

    //test.expect(totalIterations);
    test.done();
  }

});
