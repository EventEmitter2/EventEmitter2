import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('symbol Tests', () => {
  it('should support symbol keys for plain events', () => {
    let counter = 0;
    const ee = new EventEmitter2();
    const event = Symbol('event');
    const handler = function() {
      counter++;
    };
    ee.on(event, handler);
    expect(ee.listenerCount()).toBe(1);
    ee.emit(event);
    expect(counter).toBe(1);
    ee.off(event, handler);
    ee.emit(event);
    expect(counter).toBe(1);
    expect(ee.listenerCount()).toBe(0);
  });

  it('should support symbol namespace for wildcard events', () => {
    let counter = 0;
    const symbol = Symbol('test');
    const ee = new EventEmitter2({
      wildcard: true
    });
    ee.on(['event', symbol], (value) => {
      counter++;
      expect(value).toBe(123);
    });
    ee.emit(['event', symbol], 123);
    expect(counter).toBe(1);
  });
});
