import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';

function setupRemoveListenerTest(count) {
  const emitter = new EventEmitter2();
  const type = 'remove';
  const f = vi.fn();
  for (let i = 0; i < count; i++) {
    emitter.on(type, f);
  }
  return { emitter, type, f };
}


describe('removeListener Tests', () => {
  it('removeListener1. adding 1, removing 1', () => {
    const {emitter, type, f} = setupRemoveListenerTest(1);
    let listeners;

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('removeListener2. adding 2, removing 1', () => {
    const {emitter, type, f} = setupRemoveListenerTest(2);
    let listeners;

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(2);

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('removeListener3. adding 3, removing 1', () => {
    const {emitter, type, f} = setupRemoveListenerTest(3);
    let listeners;

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(3);

    //remove
    emitter.removeListener(type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(2);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('removeListener4. should error if we don\'t pass in a function', () => {
    const {emitter, type, f} = setupRemoveListenerTest(1);
    let listeners;

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    //remove
    expect(() => {
      emitter.removeListener(type, type);
    }).toThrow(Error);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(1);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('removeListener5. removing a different function, should not remove', () => {
    const emitter = new EventEmitter2();
    const type = 'remove';
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

  it('removeListener6. removing all functions by name', () => {
    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

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

  it('removeListener7. removing different event, should not remove', () => {
    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeListener(type + type, f);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeAllListeners(type + type);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeAllListeners(type);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('removeListener8. when _events doesn\'t exist', () => {
    const emitter = new EventEmitter2();
    const type = 'remove';

    delete emitter._events;
    emitter.removeAllListeners();
    emitter.removeAllListeners(type);
  });

  it('removeListener9. removing all functions - no argument provided', () => {
    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeAllListeners();
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });

  it('removeListener10. removing all functions - argument provided is "undefined"', () => {
    const {emitter, type, f} = setupRemoveListenerTest(10);
    let listeners;

    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(10);

    emitter.removeAllListeners(undefined);
    listeners = emitter.listeners(type);
    expect(listeners.length).toBe(0);

    // Function should not be called since no event is emitted
    expect(f).not.toHaveBeenCalled();
  });
});
