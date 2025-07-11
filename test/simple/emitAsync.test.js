import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('emitAsync Tests', () => {
  it('1. Receive two results from single event.', async () => {
    const emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo', () => {
      return 1;
    });
    emitter.on('foo', () => {
      return 2;
    });

    const results = await emitter.emitAsync('foo');
    expect(results[0]).toBe(1);
    expect(results[1]).toBe(2);
  });

  it('2. Receive two results from single event via promises.', async () => {
    const emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo', (i) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(i + 3);
        }, 50);
      });
    });
    emitter.on('foo', (i) => {
      return new Promise((resolve) => {
        resolve(i + 2);
      });
    });
    emitter.on('foo', (i) => {
      return Promise.resolve(i + 1);
    });
    emitter.on('foo', (i) => {
      return i + 0;
    });
    emitter.on('foo', (i) => {
      // No return value
    });

    const results = await emitter.emitAsync('foo', 0);
    expect(results[0]).toBe(3);
    expect(results[1]).toBe(2);
    expect(results[2]).toBe(1);
    expect(results[3]).toBe(0);
    expect(results[4]).toBe(undefined);
  });

  it('3. Receive two results from single event with once.', async () => {
    const emitter = new EventEmitter2({ verbose: true });

    emitter.once('foo', () => {
      return new Promise((resolve) => {
        resolve(1);
      });
    });
    emitter.on('foo', () => {
      return new Promise((resolve) => {
        resolve(2);
      });
    });

    const results = await emitter.emitAsync('foo');
    expect(results[0]).toBe(1);
    expect(results[1]).toBe(2);
  });

  it('4. Return value is always promise', async () => {
    const emitter = new EventEmitter2({ verbose: true });

    emitter.on('foo', () => {
      return new Promise((resolve) => {
        resolve(1);
      });
    });

    expect(emitter.emitAsync('foo')).toBeInstanceOf(Promise);
    expect(emitter.emitAsync('bar')).toBeInstanceOf(Promise);

    emitter.onAny(() => {
      return new Promise((resolve) => {
        resolve(2);
      });
    });
    expect(emitter.emitAsync('error')).toBeInstanceOf(Promise);

    const results = await emitter.emitAsync('error');
    expect(results[0]).toBe(2);
  });
});
