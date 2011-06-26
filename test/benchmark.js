var testCase = require('nodeunit').testCase;

module.exports = testCase({
  setUp: function (cb) {
     var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    this.emitter = new EventEmitter2(), 
    cb();
  },

  tearDown: function (cb) {
    //clean up
    cb();
  },

  '0. force JIT to get hot 10000 + 2300 emits' : function (test) {
    var iterations = 100;
    var len = 10;
    var emitter = this.emitter;

    console.time('t0');
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
      emitter.emit('1.8.6.1');
      emitter.emit('5.2.9.5');
      emitter.emit('9.5.3.6');
      emitter.emit('2.*.5.2');
      emitter.emit('7.3.*.9');
    }

    console.timeEnd('t0');
//    test.expect(1);
    test.done();
 
  },

  '1. add 1000 listener, emit 3 times' : function (test) {
    var iterations = 1;
    var len = 10;
    var emitter = this.emitter;

    console.time('t1');
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len; j++){
        for (var k = 0; k < len; k++){
          //for (var l = 0; l < len; l++){
            emitter.on([i,j,k].join('.'), function () { test.ok(true,'emit') });
          //}
        }
      }
    }

    while (iterations--) {
      emitter.emit('1.8.6');
      emitter.emit('5.2.9');
      emitter.emit('9.5.3');
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t1');
    test.expect(3);
    test.done();
  },

  '2. add 1000 listener, emit 30 times' : function (test) {
    var iterations = 10;
    var len = 10;
    var emitter = this.emitter;

    console.time('t2');
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len; j++){
        for (var k = 0; k < len; k++){
          //for (var l = 0; l < len; l++){
            emitter.on([i,j,k].join('.'), function () { test.ok(true,'emit') });
          //}
        }
      }
    }

    while (iterations--) {
      emitter.emit('1.8.6');
      emitter.emit('5.2.9');
      emitter.emit('9.5.3');
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t2');
    test.expect(30);
    test.done();
  },
  '3. add 10000 listener, emit 30 times' : function (test) {
    var iterations = 10;
    var len = 10;
    var emitter = this.emitter;

    console.time('t3');
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
      emitter.emit('1.8.6.1');
      emitter.emit('5.2.9.7');
      emitter.emit('9.5.3.1');
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t3');
    test.expect(30);
    test.done();
  },

  '4. add 10000 listener, emit 300 times' : function (test) {
    var iterations = 100;
    var len = 10;
    var emitter = this.emitter;

    console.time('t4');
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
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t4');
    test.expect(300);
    test.done();
  },

  '5. add 10000 listener, emit 300 times with EE' : function (test) {
    var iterations = 100;
    var len = 10;
    var EE = require('events').EventEmitter;
    var emitter = new EE();

    console.time('t5');
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
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t5');
    test.expect(300);
    test.done();
  },

  '6. ultra hard 10K events test with 30K emits': function (test) {
    var iterations = 10000;
    var len = 10;
    var emitter = this.emitter;

    console.time('t6');
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
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t6');
    test.expect(30000);
    test.done();
  },

 '7. ultra hard 10K events test with 30K emits, for comparison using EE': function (test) {
    var iterations = 10000;
    var len = 10;
    var EE = require('events').EventEmitter;
    var emitter = new EE();

    console.time('t7');
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
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t7');
    test.expect(30000);
    test.done();
  },

 '8. ultra hard 10K events test with 30K emits on EE2 without namespacing': function (test) {
    var iterations = 10000;
    var len = 10;
    var emitter = this.emitter;
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
    //  emitter.emit('2.*.5');
    //  emitter.emit('7.3.*');
    }

    console.timeEnd('t8');
    test.expect(30000);
    test.done();
  },

});


