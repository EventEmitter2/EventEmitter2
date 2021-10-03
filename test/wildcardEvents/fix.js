var simpleEvents = require('nodeunit').testCase;
var file = '../../lib/eventemitter2';
var EventEmitter2;
var assert= require('assert');

if (typeof require !== 'undefined') {
  EventEmitter2 = require(file).EventEmitter2;
} else {
  EventEmitter2 = window.EventEmitter2;
}

module.exports = simpleEvents({
  'listeners': {
    'should be invoked when also matching exact listener (#278)': function () {
      const ee = new EventEmitter2({ wildcard: true });

      const stack= [];

      const spy= (id)=> (...args)=> stack.push({id, args});

      ee.on('A', spy('A'));
      ee.on('B.**', spy('B'));
      ee.on('C', spy('C1'));
      ee.on('C.**', spy('C2'));

      ee.emit('A', 'A'); // Logs "A" once
      ee.emit('B', 'B'); // Logs "B" once
      ee.emit('C', 'C'); // Logs "C" only once, not matching wildcard C.**

      assert.deepStrictEqual(stack, [
        {id: 'A', args: ['A']},
        {id: 'B', args: ['B']},
        {id: 'C1', args: ['C']},
        {id: 'C2', args: ['C']},
      ]);
    }
  }
});
