import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('normalizeEvent Tests', () => {
  it('should normalize event name when emitting an event', () => {
    const ee = new EventEmitter2({
      wildcard: true
    });

    let counter = 0;

    ee.on('**', function() {
      expect(typeof this.event === 'string').toBe(true);
      expect(this.event).toBe('event.test');
      counter++;
    });

    ee.emit('event.test');
    ee.emit(['event', 'test']);
    expect(counter).toBe(2, 'event not fired');
  });

  it('should normalize event name when emitting an event in async mode', async () => {
    const ee = new EventEmitter2({
      wildcard: true
    });

    let counter = 0;

    ee.on('**', function() {
      expect(typeof this.event === 'string').toBe(true);
      expect(this.event).toBe('event.test');
      counter++;
    });

    await Promise.all([
      ee.emitAsync('event.test'),
      ee.emitAsync(['event', 'test'])
    ]);
    expect(counter).toBe(2, 'event not fired');
  });

  it('should not convert ns to a string if ns is an array and contains a symbol', () => {
    const ee = new EventEmitter2({
      wildcard: true
    });
    const symbol = Symbol('test');
    let counter = 0;

    ee.on('**', function() {
      expect(Array.isArray(this.event)).toBe(true);
      expect(this.event).toEqual(['event', symbol]);
      counter++;
    });

    ee.emit(['event', symbol]);
    expect(counter).toBe(1, 'event not fired');
  });

  it('should not convert ns to a string if ns is an array and contains a symbol while emitting in async mode', () => {
    const ee = new EventEmitter2({
      wildcard: true
    });
    const symbol = Symbol('test');
    let counter = 0;

    ee.on('**', function() {
      expect(Array.isArray(this.event)).toBe(true);
      expect(this.event).toEqual(['event', symbol]);
      counter++;
    });

    ee.emit(['event', symbol]);
    expect(counter).toBe(1, 'event not fired');
  });
});
