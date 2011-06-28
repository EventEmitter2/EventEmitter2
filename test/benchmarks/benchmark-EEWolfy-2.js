var testCase = require('nodeunit').testCase;

module.exports = testCase({

  'Ultra hard 10K events test with 30K emits, for comparison using EE': function (test) {
     var iterations = 10000;
     var len = 10;
     var EE = require('../ee_wolfy87.js').EventEmitter;
     var emitter = new EE();

     console.time('EEWolfy_2');
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

     console.timeEnd('EEWolfy_2');
     test.expect(30000);
     test.done();
   }
});
