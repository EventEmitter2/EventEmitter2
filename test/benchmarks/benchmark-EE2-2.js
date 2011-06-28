var testCase = require('nodeunit').testCase;

module.exports = testCase({

 'Ultra hard 10K events test with 30K emits on EE2 without namespacing': function (test) {
   
    var EventEmitter2 = require('../../lib/eventemitter2').EventEmitter2;
    var emitter = new EventEmitter2;

    var iterations = 10000;
    var len = 10;
    var event = '';

    console.time('t8');
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len; j++){
        for (var k = 0; k < len; k++){
          for (var l = 0; l < len; l++){
            event = [i,j,k,l,i,j,k,l].join('');
            emitter.on(event, function () { test.ok(true,'emit') });
          }
        }
      }
    }

    while (iterations--) {
      emitter.emit('16391639');
      emitter.emit('52125212');
      emitter.emit('93729372');
    }

    console.timeEnd('t8');
    test.expect(30000);
    test.done();
  }
});
