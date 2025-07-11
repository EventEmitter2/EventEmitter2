import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('emit Tests', () => {
  it('1. Add two listeners on a single event and emit the event.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const functionA = vi.fn();
    const functionB = vi.fn();

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    emitter.emit('test2');

    // Should be called once each (2 total calls)
    expect(functionA).toHaveBeenCalledTimes(1);
    expect(functionB).toHaveBeenCalledTimes(1);
  });

  it('2. Add two listeners on a single event and emit the event twice.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const functionA = vi.fn();
    const functionB = vi.fn();

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    emitter.emit('test2');
    emitter.emit('test2');

    // Should be called twice each (4 total calls)
    expect(functionA).toHaveBeenCalledTimes(2);
    expect(functionB).toHaveBeenCalledTimes(2);
  });

  it('3. Add two listeners on a single event and emit the event with a parameter.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const functionA = vi.fn((value1) => {
      expect(typeof value1).toBe('string');
    });

    const functionB = vi.fn((value1) => {
      expect(typeof value1).toBe('string');
    });

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    emitter.emit('test2', 'Hello, Node');

    // Should be called once each with correct parameter
    expect(functionA).toHaveBeenCalledTimes(1);
    expect(functionA).toHaveBeenCalledWith('Hello, Node');
    expect(functionB).toHaveBeenCalledTimes(1);
    expect(functionB).toHaveBeenCalledWith('Hello, Node');
  });

  it('4. Add two listeners on a single event and emit the event twice with a parameter.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const functionA = vi.fn((value1) => {
      expect(typeof value1).toBe('string');
    });

    const functionB = vi.fn((value1) => {
      expect(typeof value1).toBe('string');
    });

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    emitter.emit('test2', 'Hello, Node1');
    emitter.emit('test2', 'Hello, Node2');

    // Should be called twice each (4 total calls)
    expect(functionA).toHaveBeenCalledTimes(2);
    expect(functionA).toHaveBeenNthCalledWith(1, 'Hello, Node1');
    expect(functionA).toHaveBeenNthCalledWith(2, 'Hello, Node2');
    expect(functionB).toHaveBeenCalledTimes(2);
    expect(functionB).toHaveBeenNthCalledWith(1, 'Hello, Node1');
    expect(functionB).toHaveBeenNthCalledWith(2, 'Hello, Node2');
  });

  it('5. Add two listeners on a single event and emit the event twice with multiple parameters.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const functionA = vi.fn((value1, value2, value3) => {
      expect(typeof value1).toBe('string');
      expect(typeof value2).toBe('string');
      expect(typeof value3).toBe('string');
    });

    const functionB = vi.fn((value1, value2, value3) => {
      expect(typeof value1).toBe('string');
      expect(typeof value2).toBe('string');
      expect(typeof value3).toBe('string');
    });

    emitter.on('test2', functionA);
    emitter.on('test2', functionB);

    emitter.emit('test2', 'Hello, Node1', 'Hello, Node2', 'Hello, Node3');
    emitter.emit('test2', 'Hello, Node1', 'Hello, Node2', 'Hello, Node3');

    // Should be called twice each (4 total calls) with correct parameters
    expect(functionA).toHaveBeenCalledTimes(2);
    expect(functionA).toHaveBeenCalledWith('Hello, Node1', 'Hello, Node2', 'Hello, Node3');
    expect(functionB).toHaveBeenCalledTimes(2);
    expect(functionB).toHaveBeenCalledWith('Hello, Node1', 'Hello, Node2', 'Hello, Node3');
  });

  it('6. Check return values of emit.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const functionA = vi.fn();

    emitter.on('test6', functionA);

    expect(emitter.emit('test6')).toBeTruthy();
    expect(emitter.emit('other')).toBe(false);

    emitter.onAny(functionA);
    expect(emitter.emit('other')).toBeTruthy();

    // Verify function was called
    expect(functionA).toHaveBeenCalledTimes(2); // once for 'test6', once for 'other'
  });

  it('7. Check return values of wildcardEmitter.emit.', () => {
    const emitter = new EventEmitter2({ verbose: true, wildcard: true });
    const functionA = vi.fn();

    emitter.on('test7', functionA);
    emitter.on('wildcard.*', functionA);
    expect(emitter.emit('test7')).toBeTruthy();
    expect(emitter.emit('wildcard.7')).toBeTruthy();
    expect(emitter.emit('other7')).toBe(false);
    expect(emitter.emit('other.7')).toBe(false);

    // Verify function was called correctly
    expect(functionA).toHaveBeenCalledTimes(2); // once for 'test7', once for 'wildcard.7'
  });

  it('8. Emit event with more than 2 arguments', () => {
    const emitter = new EventEmitter2({ verbose: true });

    const spy = vi.fn((x, y, z) => {
      expect(x).toBe(1);
      expect(y).toBe(2);
      expect(z).toBe(3);
    });

    emitter.on('test', spy);

    emitter.emit('test', 1, 2, 3);

    // Verify function was called once with correct arguments
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 2, 3);
  });
});
