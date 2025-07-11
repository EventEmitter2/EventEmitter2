import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('ttl Tests', () => {
  it('1. A listener added with `once` should only listen once and then be removed.', () => {
    const emitter = new EventEmitter2();

    const spy = vi.fn();
    emitter.once('test1', spy);

    emitter.emit('test1');
    emitter.emit('test1');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('2. A listener with a TTL of 4 should only listen 4 times.', () => {
    const emitter = new EventEmitter2();

    const spy = vi.fn(() => {
      // The original just checked it was called, not the value
    });
    emitter.many('test1', 4, spy);

    emitter.emit('test1', 1);
    emitter.emit('test1', 2);
    emitter.emit('test1', 3);
    emitter.emit('test1', 4);
    emitter.emit('test1', 5);

    // Original expected 4 assertions
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(1, 1);
    expect(spy).toHaveBeenNthCalledWith(2, 2);
    expect(spy).toHaveBeenNthCalledWith(3, 3);
    expect(spy).toHaveBeenNthCalledWith(4, 4);
  });

  it('3. A listener with a TTL of 4 should only listen 4 times and pass parameters.', () => {
    const emitter = new EventEmitter2();

    const spy = vi.fn((value1, value2, value3) => {
      expect(typeof value1 !== 'undefined').toBe(true);
      expect(typeof value2 !== 'undefined').toBe(true);
      expect(typeof value3 !== 'undefined').toBe(true);
    });
    emitter.many('test1', 4, spy);

    emitter.emit('test1', 1, 'A', false);
    emitter.emit('test1', 2, 'A', false);
    emitter.emit('test1', 3, 'A', false);
    emitter.emit('test1', 4, 'A', false);
    emitter.emit('test1', 5, 'A', false);

    // Should be called exactly 4 times (TTL of 4), 5th emit should be ignored
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(1, 1, 'A', false);
    expect(spy).toHaveBeenNthCalledWith(2, 2, 'A', false);
    expect(spy).toHaveBeenNthCalledWith(3, 3, 'A', false);
    expect(spy).toHaveBeenNthCalledWith(4, 4, 'A', false);
  });

  it('4. Remove an event listener by signature.', () => {
    const emitter = new EventEmitter2();

    const f1 = vi.fn();
    const f2 = vi.fn();
    const f3 = vi.fn();

    emitter.on('test1', f1);
    emitter.on('test1', f2);
    emitter.on('test1', f3);

    emitter.removeListener('test1', f2);

    emitter.emit('test1');

    // Original expected 2 assertions (f1 and f3 called, f2 removed)
    expect(f1).toHaveBeenCalledTimes(1);
    expect(f2).toHaveBeenCalledTimes(0);
    expect(f3).toHaveBeenCalledTimes(1);
  });

  it('5. `removeListener` and `once`', () => {
    const emitter = new EventEmitter2();
    const functionA = vi.fn();

    emitter.once('testA', functionA);
    emitter.removeListener('testA', functionA);

    emitter.emit('testA');

    // Original expected 0 assertions (listener was removed)
    expect(functionA).toHaveBeenCalledTimes(0);
  });

  it('6. `once` followed by `on` should work fine', () => {
    // the trick here is that listeners changed in between of emit call
    const emitter = new EventEmitter2();
    const functionA = vi.fn();

    emitter.once('testA', functionA);
    emitter.on('testA', functionA);

    emitter.emit('testA');

    // Original expected 2 assertions (once: 1 call, on: 1 call)
    expect(functionA).toHaveBeenCalledTimes(2);
  });

  it('7. `onAny` handler that modifies `onAny` listeners should work fine', () => {
    // the trick here is that listeners changed in between of emit call
    const emitter = new EventEmitter2();
    const functionA = vi.fn();
    const firstHandler = vi.fn(() => {
      emitter.offAny(functionA);
    });

    emitter.onAny(firstHandler);
    emitter.onAny(functionA);

    emitter.emit('testA');

    // Original expected 1 assertion (first onAny fires)
    // functionA gets called before being removed
    expect(firstHandler).toHaveBeenCalledTimes(1);
  });
});
