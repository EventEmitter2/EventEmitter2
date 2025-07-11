import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('removeAllListeners Tests', () => {
  it('should remove all wildcard events', () => {
    let counter = 0;

    const ee = new EventEmitter2({
      wildcard: true
    });

    ee.on('test.*', () => {
      counter++;
    });

    expect(ee.listenerCount('test.*')).toBe(1);

    ee.emit('test.foo');

    expect(counter).toBe(1);
    ee.removeAllListeners();

    expect(ee.listenerCount('test.*')).toBe(0);
  });
});
