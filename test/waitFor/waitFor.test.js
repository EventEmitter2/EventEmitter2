import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('waitFor Tests', () => {
  it('1. should return thenable object that resolves when an event occurs', async () => {
    const emitter = new EventEmitter2({verbose: true});

    const thenable = emitter.waitFor('foo');

    expect(typeof thenable.then === 'function').toBe(true);
    expect(typeof thenable.cancel === 'function').toBe(true);

    let timestamp;
    setTimeout(() => {
      timestamp = Date.now();
      emitter.emit('foo', 1, 2);
    }, 50);

    const data = await thenable;
    expect(Date.now() - timestamp >= 0).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0]).toBe(1);
    expect(data[1]).toBe(2);
  });

  it('2. should reject thenable if timeout', async () => {
    const emitter = new EventEmitter2({verbose: true});
    const timestamp = Date.now();
    const promise = emitter.waitFor('foo', {
      timeout: 50
    });
    await expect(promise).rejects.toThrow('timeout');
    expect(Date.now() - timestamp >= 0).toBe(true);
  });

  it('3. should reject thenable if cancel method was called', async () => {
    const emitter = new EventEmitter2({verbose: true});
    let timestamp;
    const thenable = emitter.waitFor('foo');

    setTimeout(() => {
      timestamp = Date.now();
      thenable.cancel();
    }, 50);

    await expect(thenable).rejects.toThrow('canceled');
    expect(Date.now() - timestamp >= 0).toBe(true);
  });

  it('4. should handle an error when handleError option is used', async () => {
    const emitter = new EventEmitter2({verbose: true});

    const promise = emitter.waitFor('foo', {
      handleError: true
    });

    emitter.emit('foo', null, 1, 2);
    const data = await promise;
    expect(data.length).toBe(2);
    expect(data[0]).toBe(1);
    expect(data[1]).toBe(2);
  });

  it('5. should be able to filter event by data using the filter callback option', async () => {
    const emitter = new EventEmitter2({verbose: true});

    const promise = emitter.waitFor('foo', {
      filter (arg0) {
        return arg0 === 2;
      },
      timeout: 50
    });

    emitter.emit('foo', 1);
    emitter.emit('foo', 2);
    const data = await promise;
    expect(data[0]).toBe(2);
  });

  it('6. should clean internal listeners once its promise resolved', async () => {
    const emitter = new EventEmitter2({verbose: true});

    const promise = emitter.waitFor('foo', {
      filter (arg0) {
        return arg0 === 2;
      },
      timeout: 50
    });

    expect(emitter.listenerCount()).toBe(1);
    emitter.emit('foo', 2);
    const data = await promise;
    expect(data[0]).toBe(2);
    expect(emitter.listenerCount()).toBe(0);
  });

  it('7. should clean internal listeners once its promise resolved (wildcard)', async () => {
    const emitter = new EventEmitter2({verbose: true, wildcard: true});

    const promise = emitter.waitFor('foo.*', {
      filter (arg0) {
        return arg0 === 2;
      },
      timeout: 50
    });

    expect(emitter.listenerCount('**')).toBe(1);
    emitter.emit('foo.bar', 2);
    const data = await promise;
    expect(data[0]).toBe(2);
    expect(emitter.listenerCount('**')).toBe(0);
  });
});
