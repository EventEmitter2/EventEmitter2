;!function(root) {

  // Check server side *require* availability.
  var req = (typeof require !== 'undefined');

  // Require *EventEmitter2* if it's not already present.
  var EventEmitter2 = root.EventEmitter2;
  if (!EventEmitter2 && req) EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
  if (!EventEmitter2) throw new Error('Dependency missing: EventEmitter2');

  var emitter = new EventEmitter2(),
      fn1 = function fn1() {},
      fn2 = function fn2() {},
      fn3 = function fn3() {},
      fn4 = function fn4() {},
      fn5 = function fn5() {};

  root.testAddListener = {
    '1. Add a single namespace listener': function(test) {
      emitter.on('single', fn1);

      var _events = {
        'single': {
          _name: 'single',
          _listeners: [fn1],
          _ns: {}
        }
      }

      test.deepEqual(emitter._events, _events);
      test.done();
    },
    '2. Add a double namespace listener': function(test) {
      emitter.on('single.double', fn2);

      var _events = {
        'single': {
          _name: 'single',
          _listeners: [fn1],
          _ns: {
            'double': {
              _name: 'double',
              _listeners: [fn2],
              _ns: {}
            }
          }
        }
      }

      test.deepEqual(emitter._events, _events);
      test.done();
    },
    '3. Add a triple namespace listener': function(test) {
      emitter.on('single.double.triple', fn3);

      var _events = {
        'single': {
          _name: 'single',
          _listeners: [fn1],
          _ns: {
            'double': {
              _name: 'double',
              _listeners: [fn2],
              _ns: {
                'triple': {
                  _name: 'triple',
                  _listeners: [fn3],
                  _ns: {}
                }
              }
            }
          }
        }
      }

      test.deepEqual(emitter._events, _events);
      test.done();
    },
    '4. Add a quadruple namespace listener': function(test) {
      emitter.on('single.double.triple.quadruple', fn4);

      var _events = {
        'single': {
          _name: 'single',
          _listeners: [fn1],
          _ns: {
            'double': {
              _name: 'double',
              _listeners: [fn2],
              _ns: {
                'triple': {
                  _name: 'triple',
                  _listeners: [fn3],
                  _ns: {
                    'quadruple': {
                      _name: 'quadruple',
                      _listeners: [fn4],
                      _ns: {}
                    }
                  }
                }
              }
            }
          }
        }
      }

      test.deepEqual(emitter._events, _events);
      test.done();
    }
  };

}(typeof exports === 'undefined' ? window : exports);
  