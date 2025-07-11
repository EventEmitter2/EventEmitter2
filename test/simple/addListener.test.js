import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('addListener Tests', () => {
  it('1. Add a single listener on a single event.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const spy = vi.fn();
    emitter.on('test1', spy);

    expect(emitter.listeners('test1').length).toBe(1);
    // Function should not be called since no event is emitted
    expect(spy).not.toHaveBeenCalled();
  });

  it('2. Add two listeners on a single event.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    emitter.on('test1', spy1);
    emitter.on('test1', spy2);

    expect(emitter.listeners('test1').length).toBe(2);
    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('3. Add three listeners on a single event.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();
    emitter.on('test1', spy1);
    emitter.on('test1', spy2);
    emitter.on('test1', spy3);

    expect(emitter.listeners('test1').length).toBe(3);
    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('4. Add two listeners to two different events.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();
    const spy4 = vi.fn();
    emitter.on('test1', spy1);
    emitter.on('test1', spy2);
    emitter.on('test2', spy3);
    emitter.on('test2', spy4);

    expect(emitter.listeners('test1').length).toBe(2);
    expect(emitter.listeners('test2').length).toBe(2);
    // Functions should not be called since no events are emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
    expect(spy4).not.toHaveBeenCalled();
  });

  it('5. Never adding any listeners should yield a listeners array with the length of 0.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const spy = vi.fn();
    emitter.on('test1', spy);

    expect(emitter.listeners('test2').length).toBe(0);
    // Function should not be called since no event is emitted
    expect(spy).not.toHaveBeenCalled();
  });

  it('6. the listener added should be the right listener.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const type = 'somelistenerbar';
    const f = function () {};

    emitter.on(type, f);
    expect(emitter.listeners(type).length).toBe(1);
    expect(emitter.listeners(type)[0]).toBe(f);
  });

  it('7. should be able to listen on any event', () => {
    const emitter = new EventEmitter2({ verbose: true });

    let eventBeingTestedFor, expectedArgument;
    const f = vi.fn((event, argument) => {
      // Original test had 3 assertions per call - we keep the meaningful ones
      expect(eventBeingTestedFor).toBe(event); // 'the event is ' + event
      expect(expectedArgument).toBe(argument); // 'the argument is ' + argument
    });

    emitter.onAny(f);
    emitter.emit(eventBeingTestedFor = 'test23.ns5.ns5', expectedArgument = 'someData'); //1 call
    emitter.offAny(f);
    expectedArgument = undefined;
    emitter.emit(eventBeingTestedFor = 'test21'); //0 calls
    emitter.onAny(f);
    emitter.onAny(f); // Add f twice
    emitter.emit(eventBeingTestedFor = 'test23.ns5.ns5', expectedArgument = 'someData'); //2 calls

    // Should be called 3 times total (1 + 0 + 2), original expected 9 assertions (3*3)
    expect(f).toHaveBeenCalledTimes(3);
  });

  it('8. should be able to listen on any event (should cause an error)', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const f = vi.fn();
    emitter.onAny(f);

    emitter.emit('error');

    // Should be called once
    expect(f).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledWith('error');
  });

  it('9. onAny alias', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const f = vi.fn();

    emitter.on(f); // This is the onAny alias

    emitter.emit('foo');
    emitter.emit('bar');

    // Should be called twice
    expect(f).toHaveBeenCalledTimes(2);
    expect(f).toHaveBeenNthCalledWith(1, 'foo');
    expect(f).toHaveBeenNthCalledWith(2, 'bar');
  });

  it('10. onAny with invalid argument', () => {
    const emitter = new EventEmitter2({ verbose: true });

    expect(() => {
      emitter.onAny(null);
    }).toThrow();

    expect(emitter.emit('foo')).toBe(false);
  });

  it('11. listenerCount should return the number of listeners', () => {
    const emitter = new EventEmitter2({ verbose: true });

    // Original had 3 assertions total
    expect(emitter.listenerCount('test1')).toBe(0); // 1st assertion

    const spy1 = vi.fn();
    emitter.on('test1', spy1);

    expect(emitter.listenerCount('test1')).toBe(1); // 2nd assertion

    const spy2 = vi.fn();
    emitter.on('test1', spy2);

    expect(emitter.listeners('test1').length).toBe(2); // 3rd assertion

    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('12. should support wrapping handler to an async listener', () => {
    return new Promise((resolve, reject) => {
      try {
        const ee = new EventEmitter2();
        let counter = 0;
        const f = function(x) {
          expect(x).toBe(123);
          counter++;
        };
        ee.on('test', f, false);
        expect(ee.listenerCount()).toBe(1);
        ee.emit('test', 123);
        expect(counter).toBe(0);
        setTimeout(() => {
          expect(counter).toBe(1);
          ee.off('test', f);
          expect(ee.listenerCount()).toBe(0);
          resolve();
        }, 10);
      } catch (error) {
        reject(error);
      }
    });
  });

  it('13. should support wrapping handler to a promised listener using setImmediate', () => {
    return new Promise((resolve, reject) => {
      try {
        const ee = new EventEmitter2();
        let counter = 0;
        const f = function(x) {
          expect(x).toBe(123);
          counter++;
          return x + 1;
        };

        ee.on('test', f, {promisify: true});

        ee.emitAsync('test', 123).then((arg) => {
          expect(counter).toBe(1);
          expect(arg[0]).toBe(124);
          resolve();
        }, reject);

        expect(counter).toBe(0);
      } catch (error) {
        reject(error);
      }
    });
  });

  it('14. should support wrapping handler to an async listener using nextTick', () => {
    return new Promise((resolve, reject) => {
      try {
        const ee = new EventEmitter2();
        let counter = 0;
        const f = function(x) {
          expect(x).toBe(123);
          counter++;
        };
        ee.on('test', f, {nextTick: true});
        expect(ee.listenerCount()).toBe(1);
        ee.emit('test', 123);
        expect(counter).toBe(0);
        process.nextTick(() => {
          expect(counter).toBe(1);
          ee.off('test', f);
          expect(ee.listenerCount()).toBe(0);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  });

  it('15. should support wrapping once listener to an async listener', () => {
    return new Promise((resolve, reject) => {
      try {
        const ee = new EventEmitter2();
        let counter = 0;
        const f = function (x) {
          expect(x).toBe(123);
          counter++;
        };
        ee.once('test', f, false);
        expect(ee.listenerCount()).toBe(1);
        ee.emit('test', 123);
        expect(counter).toBe(0);
        setTimeout(() => {
          expect(counter).toBe(1);
          ee.off('test', f);
          expect(ee.listenerCount()).toBe(0);
          resolve();
        }, 10);
      } catch (error) {
        reject(error);
      }
    });
  });

  it('16. should support returning a listener object if the objectify options is set', () => {
    const ee = new EventEmitter2();
    let counter = 0;
    const handler = function (x) {
      expect(x).toBe(123);
      counter++;
    };

    const listener = ee.on('test', handler, {
      objectify: true
    });

    expect(typeof listener).toBe('object');
    expect(listener.constructor.name).toBe('Listener');
    expect(typeof listener.off).toBe('function');
    expect(listener.emitter).toBe(ee);
    expect(listener.event).toBe('test');
    expect(listener.listener).toBe(handler);

    expect(counter).toBe(0);

    ee.emit('test', 123);
    expect(counter).toBe(1);

    listener.off();

    ee.emit('test', 123);
    expect(counter).toBe(1);
  });

  it('17. should support returning a listener object using the `once` method if the objectify options is set', () => {
    const ee = new EventEmitter2();
    let counter = 0;
    const handler = function (x) {
      expect(x).toBe(123);
      counter++;
    };

    const listener = ee.once('test', handler, {
      objectify: true
    });

    expect(typeof listener).toBe('object');
    expect(listener.constructor.name).toBe('Listener');
    expect(typeof listener.off).toBe('function');
    expect(listener.emitter).toBe(ee);
    expect(listener.event).toBe('test');
    expect(listener.listener._origin).toBe(handler);

    expect(counter).toBe(0);

    listener.off();

    ee.emit('test', 123);

    expect(counter).toBe(0);
  });
});
