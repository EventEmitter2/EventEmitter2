import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('wildcardEvents all Tests', () => {
  it('1. An event can be namespaced.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn();
    emitter.on('test1.ns1', spy);

    emitter.emit('test1.ns1');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('2. An event can be namespaced and accept values.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn((value1) => {
      expect(typeof value1 !== 'undefined').toBe(true);
    });
    emitter.on('test2.ns1', spy);

    emitter.emit('test2.ns1', 1);

    // Original expected 2 assertions (1 for being called + 1 for parameter)
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('3. A namespaced event can be raised multiple times and accept values.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn(function (value1, value2, value3) {
      expect(arguments.length === 3).toBe(true);
      expect(value1 === 1 || value1 === 4).toBe(true);
      expect(value2 === 2 || value2 === 5).toBe(true);
      expect(value3 === 3 || value3 === 6).toBe(true);
    });
    emitter.on('test3.ns1', spy);

    emitter.emit('test3.ns1', 1, 2, 3);
    emitter.emit('test3.ns1', 4, 5, 6);

    // Original expected 10 assertions (2 emissions × 5 assertions each)
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, 1, 2, 3);
    expect(spy).toHaveBeenNthCalledWith(2, 4, 5, 6);
  });

  it('4. A listener should support wild cards.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn();
    emitter.on('test4.*', spy);

    emitter.emit('test4.ns1');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('5. Emitting an event should support wildcards.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn();
    emitter.on('test5A.test5B', spy);

    emitter.emit('test5A.*');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('6. A listener should support complex wild cards.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn();
    emitter.on('test10.*.foo', spy);

    emitter.emit('test10.ns1.foo');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('7. Emitting an event should support complex wildcards.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn();
    emitter.on('test11.ns1.foo', spy);

    emitter.emit('test11.*.foo');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('8. Emitting an event should support complex wildcards multiple times, a valid listener should accept values.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy = vi.fn(function (value1, value2, value3) {
      expect(arguments.length === 3).toBe(true);
      expect(value1 === 1 || value1 === 4).toBe(true);
      expect(value2 === 2 || value2 === 5).toBe(true);
      expect(value3 === 3 || value3 === 6).toBe(true);
    });
    emitter.on('test12.ns1.ns2', spy);

    emitter.emit('test12.*.ns2', 1, 2, 3);
    emitter.emit('test12.*.ns2', 4, 5, 6);

    // Original expected 10 assertions (2 emissions × 5 assertions each)
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, 1, 2, 3);
    expect(spy).toHaveBeenNthCalledWith(2, 4, 5, 6);
  });

  it('9. List all the listeners for a particular event.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    emitter.on('test13', spy1);
    emitter.on('test13', spy2);

    const listeners = emitter.listeners('test13');

    expect(listeners.length === 2).toBe(true);
    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('10. should be able to listen on any event with 3 arguments', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const fn = vi.fn(function (event, foo, bar) {
      expect(this.event).toBe('test23.ns5.ns5');
      expect(event).toBe('test23.ns5.ns5');
      expect(foo).toBe('foo');
      expect(bar).toBe(1);
    });

    emitter.onAny(fn);
    emitter.emit('test23.ns5.ns5', 'foo', 1);

    // Original expected 5 assertions (1 for being called + 4 parameter checks)
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('test23.ns5.ns5', 'foo', 1);
  });

  it('11. should be able to listen on any event with 4 arguments', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const fn = vi.fn(function (event, foo, bar, baz) {
      expect(this.event).toBe('test23.ns5.ns5');
      expect(event).toBe('test23.ns5.ns5');
      expect(foo).toBe('foo');
      expect(bar).toBe(1);
      expect(baz).toBe('baz');
    });

    emitter.onAny(fn);
    emitter.emit('test23.ns5.ns5', 'foo', 1, 'baz');

    // Original expected 6 assertions (1 for being called + 5 parameter checks)
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('test23.ns5.ns5', 'foo', 1, 'baz');
  });

  it('12. No warning should be raised if we set maxListener to be greater before adding', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test29.*';
    const spies = [];

    // set to 20
    emitter.setMaxListeners(20);

    for (let i = 0; i < 15 ; i++) {
      const spy = vi.fn();
      spies.push(spy);
      emitter.on(type, spy);
    }

    const listeners = emitter.listeners(type);
    expect(listeners.length).toBe(15);
    expect(emitter.listenerTree['test29']?.['*']?._listeners?.warned).toBeFalsy();

    // Functions should not be called since no event is emitted
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });
});
