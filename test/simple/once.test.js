import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';
import BBPromise from 'bluebird';

// Configure BlueBird promises
BBPromise.config({
  cancellation: true
});

describe('once Tests', () => {
  it('1. should return a Promise', () => {
    const ee = new EventEmitter2();
    const result = EventEmitter2.once(ee, 'event');
    expect(result).toBeInstanceOf(Promise);
  });

  it('2. should resolve the promise when a specific event occurs', async () => {
    const ee = new EventEmitter2();
    const promise = EventEmitter2.once(ee, 'event');
    ee.emit('event');
    await promise; // Should resolve without error
  });

  it('3. should handle the event data arguments as an array', async () => {
    const ee = new EventEmitter2();
    const promise = EventEmitter2.once(ee, 'event');
    ee.emit('event', 1, 2, 3);
    const data = await promise;
    expect(data).toEqual([1, 2, 3]);
  });

  it('4. should reject the promise if an error event emitted', async () => {
    const ee = new EventEmitter2();
    const message = 'test';
    const promise = EventEmitter2.once(ee, 'event');
    ee.emit('error', new Error(message));
    await expect(promise).rejects.toThrow(message);
  });

  it('5. should support cancellation', async () => {
    const ee = new EventEmitter2();
    const message = 'canceled';
    const promise = EventEmitter2.once(ee, 'event');
    setTimeout(() => {
      promise.cancel();
    }, 50);
    await expect(promise).rejects.toThrow(message);
  });

  it('6. should support timeout handling', async () => {
    const ee = new EventEmitter2();
    const message = 'timeout';
    const promise = EventEmitter2.once(ee, 'event', {
      timeout: 10
    });
    await expect(promise).rejects.toThrow(message);
  });

  it('7. should support BlueBird promises', async () => {
    const ee = new EventEmitter2();
    const promise = EventEmitter2.once(ee, 'event', {
      Promise: BBPromise
    });
    ee.emit('event', 1, 2, 3);
    const data = await promise;
    expect(data).toEqual([1, 2, 3]);
  });

  it('8. should support BlueBird promise silent cancellation', async () => {
    const ee = new EventEmitter2();
    const bbPromise = EventEmitter2.once(ee, 'event', {
      Promise: BBPromise
    });
    bbPromise.cancel();
    ee.emit('event');
    // Just ensure no error is thrown, test passes if it completes
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  it('9. should support overloading cancellation api', async () => {
    const ee = new EventEmitter2();
    const message = 'canceled';
    const bbPromise = EventEmitter2.once(ee, 'event', {
      Promise: BBPromise,
      overload: true
    });
    bbPromise.cancel();
    await expect(bbPromise).rejects.toThrow(message);
  });
});
