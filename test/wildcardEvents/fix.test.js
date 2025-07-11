import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('fix Tests', () => {
  it('should be invoked when also matching exact listener (#278)', () => {
    const ee = new EventEmitter2({ wildcard: true });

    const stack = [];

    const spy = (id) => (...args) => stack.push({id, args});

    ee.on('A', spy('A'));
    ee.on('B.**', spy('B'));
    ee.on('C', spy('C1'));
    ee.on('C.**', spy('C2'));

    ee.emit('A', 'A'); // Logs "A" once
    ee.emit('B', 'B'); // Logs "B" once
    ee.emit('C', 'C'); // Logs "C" only once, not matching wildcard C.**

    expect(stack).toEqual([
      {id: 'A', args: ['A']},
      {id: 'B', args: ['B']},
      {id: 'C1', args: ['C']},
      {id: 'C2', args: ['C']}
    ]);
  });
});
