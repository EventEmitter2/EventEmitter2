var assert = require('assert');
var EventEmitter2 = require('../../lib/eventemitter2').EventEmitter2;

module.exports = {
  'hasListeners without an event reports wildcard listeners': function () {
    var emitter = new EventEmitter2({ wildcard: true });
    var listener = function () {};

    assert.strictEqual(emitter.hasListeners(), false);
    emitter.on('user.*', listener);
    assert.strictEqual(emitter.hasListeners(), true);
    assert.strictEqual(emitter.hasListeners('user.created'), true);
    emitter.off('user.*', listener);
    assert.strictEqual(emitter.hasListeners(), false);
  },

  'hasListeners without an event reports onAny listeners': function () {
    var emitter = new EventEmitter2({ wildcard: true });
    var listener = function () {};

    emitter.onAny(listener);
    assert.strictEqual(emitter.hasListeners(), true);
    emitter.offAny(listener);
    assert.strictEqual(emitter.hasListeners(), false);
  }
};
