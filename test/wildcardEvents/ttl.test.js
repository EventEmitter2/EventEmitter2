import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('ttl Tests', () => {
  it('1. A listener added with `once` should only listen once and then be removed.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.bar';
    const spy = vi.fn();

    emitter.once(type, spy);

    emitter.emit(type);
    emitter.emit(type);

    // Should only be called once
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('2. A listener with a TTL of 4 should only listen 4 times.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.bar';
    const spy = vi.fn();

    emitter.many(type, 4, spy);

    emitter.emit(type, 1);
    emitter.emit(type, 2);
    emitter.emit(type, 3);
    emitter.emit(type, 4);
    emitter.emit(type, 5);

    // Should be called exactly 4 times
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('3. A listener with a TTL of 4 should only listen 4 times and pass parameters.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.bar';
    const spy = vi.fn((value1, value2, value3) => {
      expect(typeof value1 !== 'undefined').toBe(true);
      expect(typeof value2 !== 'undefined').toBe(true);
      expect(typeof value3 !== 'undefined').toBe(true);
    });

    emitter.many(type, 4, spy);

    emitter.emit(type, 1, 'A', false);
    emitter.emit(type, 2, 'A', false);
    emitter.emit(type, 3, 'A', false);
    emitter.emit(type, 4, 'A', false);
    emitter.emit(type, 5, 'A', false);

    // Should be called exactly 4 times with correct parameters
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(1, 1, 'A', false);
    expect(spy).toHaveBeenNthCalledWith(2, 2, 'A', false);
    expect(spy).toHaveBeenNthCalledWith(3, 3, 'A', false);
    expect(spy).toHaveBeenNthCalledWith(4, 4, 'A', false);
  });

  it('4. Remove an event listener by signature.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.bar';
    const f1 = vi.fn();
    const f2 = vi.fn();
    const f3 = vi.fn();

    emitter.on(type, f1);
    emitter.on(type, f2);
    emitter.on(type, f3);

    emitter.removeListener(type, f2);

    emitter.emit(type);

    // f1 and f3 should be called, but not f2
    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(0);
    expect(f3).toHaveBeenCalledTimes(1);
  });

  it('5. `removeListener` and `once`', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.bar';
    const spy = vi.fn();

    emitter.once(type, spy);
    emitter.removeListener(type, spy);

    emitter.emit(type);

    // Should not be called since listener was removed
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('6. Listening with a wildcard on once', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.*';
    const spy = vi.fn();

    emitter.once(type, spy);
    emitter.on(type, spy);

    emitter.emit(type); //2
    emitter.emit(type); //1

    // Should be called 3 times total (once: 1 time, on: 2 times)
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('7. Emitting with a wildcard targeted at once', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.bar';
    const type2 = 'test1.foo.*';
    const spy = vi.fn();

    emitter.once(type, spy);
    emitter.emit(type2);
    emitter.emit(type2);

    // Should be called only 1 time (once listener triggered by first wildcard emit)
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('8. Emitting with a multi-level wildcard on once', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    let i = 0;
    const type = 'test1.**';
    const onceSpy = vi.fn();
    const onSpy = vi.fn();

    const functionA = function(n) {
      return function() {
        console.log(n, this.event);
        if (n === 0) {
          onceSpy();
        } else {
          onSpy();
        }
      };
    };

    emitter.once(type, functionA(i++));
    emitter.on(type, functionA(i++));
    emitter.emit(type); //2
    emitter.emit(type); //1

    // Should be called 3 times total (once: 1 time, on: 2 times)
    expect(onceSpy).toHaveBeenCalledTimes(1);
    expect(onSpy).toHaveBeenCalledTimes(2);
  });

  it('9. Emitting with a multi-level wildcard targeted at once', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const type = 'test1.foo.bar';
    const type2 = 'test1.**';
    const spy = vi.fn();

    emitter.once(type, spy);
    emitter.emit(type2);
    emitter.emit(type2);

    // Should be called only 1 time (once listener triggered by first wildcard emit)
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
