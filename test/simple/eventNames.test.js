import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('eventNames Tests', () => {
  it('1. Test event names function.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo', () => {});
    emitter.on('bar', () => {});

    const eventNames = emitter.eventNames();
    eventNames.sort();
    expect(eventNames.length).toBe(2);
    expect(eventNames[0]).toBe('bar');
    expect(eventNames[1]).toBe('foo');
  });
});
