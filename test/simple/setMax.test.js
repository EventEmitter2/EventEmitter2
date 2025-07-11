import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('setMax Tests', () => {
  it('setMaxListener1. default behavior of 10 listeners.', () => {
    const emitter = new EventEmitter2();
    const spies = [];

    for (let i = 0; i < 10; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on('foobar', spy);
    }

    const listeners = emitter.listeners('foobar');
    expect(listeners.length).toBe(10);

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });

  it('setMaxListener2. If we added more than 10, should not see them', () => {
    const emitter = new EventEmitter2();
    const spies = [];

    for (let i = 0; i < 10; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on('foobar2', spy);
    }
    console.log('should see EE2 complaining:');
    const extraSpy = vi.fn();
    spies.push(extraSpy);
    emitter.on('foobar2', extraSpy);

    const listeners = emitter.listeners('foobar2');
    expect(listeners.length).toBe(11);
    expect(emitter._events['foobar2'].warned).toBeTruthy();

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });

  it('setMaxListener3. if we set maxListener to be greater before adding', () => {
    const emitter = new EventEmitter2();
    const type = 'foobar3';
    const spies = [];

    // set to 20
    emitter.setMaxListeners(20);

    for (let i = 0; i < 15; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on(type, spy);
    }

    const listeners = emitter.listeners(type);
    expect(listeners.length).toBe(15);
    expect(emitter._events[type]?.warned).toBeFalsy();

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });

  it('setMaxListener4. should be able to change it right at 10', () => {
    const emitter = new EventEmitter2();
    const type = 'foobar4';
    const spies = [];

    for (let i = 0; i < 10; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on(type, spy);
    }

    emitter.setMaxListeners(9001);
    const extraSpy = vi.fn();
    spies.push(extraSpy);
    emitter.on(type, extraSpy);

    const listeners = emitter.listeners(type);
    expect(listeners.length).toBe(11);
    expect(emitter._events[type]?.warned).toBeFalsy();

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });

  it('setMaxListener5. if we set maxListener to be 0 should add endlessly', () => {
    const emitter = new EventEmitter2();
    const type = 'foobar';
    const spies = [];

    // set to 0
    emitter.setMaxListeners(0);

    for (let i = 0; i < 25; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on(type, spy);
    }

    const listeners = emitter.listeners(type);
    expect(listeners.length).toBe(25);
    expect(emitter._events[type]?.warned).toBeFalsy();

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });

  it('setMaxListener6. if we set maxListener to be 1 should warn for 2 listeners', () => {
    const emitter = new EventEmitter2();
    const type = 'ns1';

    emitter.setMaxListeners(1);

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    emitter.on(type, spy1);
    emitter.on(type, spy2);

    expect(emitter._events[type]?.warned).toBeTruthy();

    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('maxListeners parameter 1. Passing maxListeners as a parameter should override default.', () => {
    const emitter = new EventEmitter2({
      maxListeners: 2
    });

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();
    emitter.on('a', spy1);
    emitter.on('a', spy2);
    emitter.on('a', spy3);
    expect(emitter._events.a?.warned).toBeTruthy();

    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('maxListeners parameter 2. Passing maxListeners with value 0 as a parameter should override default.', () => {
    const emitter = new EventEmitter2({
      maxListeners: 0
    });
    const type = 'ns1';
    const spies = [];

    for (let i = 0; i < 12; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on(type, spy);
    }

    expect(emitter._events[type]?.warned).toBeFalsy();

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });

  it('should use process.emitWarning if available', async () => {
    // Don't run this test if `process.emitWarning` is not available
    if (typeof process === 'undefined' || !process.emitWarning) {
      return;
    }

    const emitter = new EventEmitter2();
    const warningSpy = vi.spyOn(process, 'emitWarning');
    const spies = [];

    for (let i = 0; i < 11; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on('foobar2', spy);
    }

    expect(warningSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'MaxListenersExceededWarning',
        count: 11
      })
    );

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });
});
