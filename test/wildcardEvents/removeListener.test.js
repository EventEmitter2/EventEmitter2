import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('removeListener Tests', () => {
  it('1. add a single event and then remove the event.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'remove.foo.bar';
    let listeners;

    const f = vi.fn();

    emitter.on(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('2. Add two events and then remove only one of those events.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'remove.foo.bar';
    let listeners;

    const f = vi.fn();

    emitter.on(type, f);
    emitter.on(type, f);

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(2);

    emitter.removeListener(type, f);

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('3. Add three events and remove only one of the events that was added.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'remove.foo.bar';
    let listeners;

    const f = vi.fn();

    emitter.on(type, f);
    emitter.on(type, f);
    emitter.on(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(3);

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(2);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('4. Should error if we don\'t pass a function to the emit method.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'remove.foo.bar';
    let listeners;

    const f = vi.fn();

    emitter.on(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    //remove
    expect(() => emitter.removeListener(type, type)).toThrow(Error);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('5. Removing one listener should not affect another listener.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'remove.foo.bar';
    let listeners;

    const f = vi.fn();
    const g = vi.fn();

    emitter.on(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    //remove
    emitter.removeListener(type, g);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    // Functions should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
    expect(g).not.toHaveBeenCalled();
  });

  it('6. Remove all listener functions.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'remove.foo.bar';
    let listeners;

    const f = vi.fn();
    for (let i = 0; i < 10; i++) {
      emitter.on(type, f);
    }

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(9);
    emitter.removeAllListeners(type);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('7. Removing listeners for one event should not affect another event\'s listeners.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'remove.foo.bar';
    let listeners;

    const f = vi.fn();

    for (let i = 0; i < 10; i++) {
      emitter.on(type, f);
    }

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeListener(type + type, f);

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeAllListeners(type + type);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeAllListeners(type + '.' + type);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeAllListeners(type);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('8. Its ok to listen on wildcard, so it is ok to remove it.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type1 = '*.wild.card';
    const type2 = 'just.another.event';

    const f = vi.fn();

    emitter.on(type2, f);
    emitter.on(type1, f);

    //remove
    emitter.removeListener(type1, f);
    const listeners = emitter.listeners(type1);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('9. And (8) should not depend on order of listening.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type1 = '*.wild.card';
    const type2 = 'just.another.event';

    const f = vi.fn();

    emitter.on(type1, f);
    emitter.on(type2, f);

    //remove
    emitter.removeListener(type1, f);
    const listeners = emitter.listeners(type1);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('10. Reporting many listeners on wildcard all should removed.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type1 = '*.wild.card';
    const type2 = 'exact.wild.card';
    let listeners;

    const f = vi.fn();

    emitter.on(type1, f);
    emitter.on(type2, f);

    // check number of listeners by wild card
    listeners = emitter.listeners(type1);
    expect(listeners.length).toBe(2);

    // remove by wild card should remove both
    emitter.removeListener(type1, f);
    listeners = emitter.listeners(type1);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('11. Add some listeners with wildcards and remove only the wildcard', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    let count = 0;
    const goodCallback = vi.fn(() => {
      count += 1;
    });
    const badCallback = vi.fn(() => {
      count += 1;
    });

    // So that foo.bar.listeners is an Array
    emitter.on('foo.bar.baz', goodCallback);
    emitter.on('foo.bar.baz', goodCallback);

    // Add and remove one with wildcard
    emitter.on('foo.*.*', badCallback);
    const returnValue = emitter.off('foo.*.*', badCallback);

    emitter.emit('foo.bar.baz');

    // Original expected count to be 2 (only good callbacks called)
    expect(count).toBe(2);
    expect(returnValue).toBe(emitter);

    // Verify call counts
    expect(goodCallback).toHaveBeenCalledTimes(2);
    expect(badCallback).not.toHaveBeenCalled(); // Was removed before emit
  });
});
