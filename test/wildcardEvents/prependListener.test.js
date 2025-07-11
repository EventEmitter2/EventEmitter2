import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('prependListener Tests', () => {
  it('use prepend on wildcards mode', () => {
    const ee = new EventEmitter2({
      wildcard: true
    });
    const type = ['some', 'listener', 'bar'];
    const function1 = function () {};
    const function2 = function () {};

    ee.on(type, function2);
    ee.prependListener(type, function1);
    expect(ee.listeners(type)).toEqual([function1, function2]);
  });
});
