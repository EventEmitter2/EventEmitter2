var testCase = require('nodeunit').testCase;

module.exports = testCase({

  'Add 10000 listener, emit 300 times with EE' : function (test) {
    var iterations = 100;
    var len = 10;
    var EE = require('../ee_tmpvar.js').EventEmitter;
    var emitter = new EE();

    console.time('EETmpVar_1');
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len; j++){
        for (var k = 0; k < len; k++){
          for (var l = 0; l < len; l++){
            emitter.on([i,j,k,l].join('.'), function () { test.ok(true,'emit') });
          }
        }
      }
    }

    while (iterations--) {
      emitter.emit('1.8.6.3');
      emitter.emit('5.2.9.1');
      emitter.emit('9.5.3.8');
    }

    console.timeEnd('EETmpVar_1');
    test.expect(300);
    test.done();
  }
});
