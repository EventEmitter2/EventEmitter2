var testCase = require('nodeunit').testCase;

module.exports = testCase({

  'Add 10000 listener, emit 300 times' : function (test) {

    var EventEmitter2 = require('../em').EventEmitter2;
    var emitter = new EventEmitter2;

    var totalIterations = 100000;
    var iterations = totalIterations;
    var names = [];

    while(iterations--) {
      names[iterations] = Math.pow(2*10, Math.random()).toString().replace('.', '');
    }

    iterations = totalIterations;

    console.time('EE2_New');

    while (iterations--) {
      emitter.on(names[iterations], function () { test.ok(true,'emit') });
    }

    iterations = totalIterations;

    while (iterations--) {
      emitter.emit(names[iterations]);
    }
    
    console.timeEnd('EE2_New');

    //test.expect(totalIterations);
    test.done();
  }

});
