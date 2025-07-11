import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('reconfigure Tests', () => {
  it('reconfigure1. initialize, removeAllListeners', () => {
    let emitter;
    const config = {
      wildcard: true, // should the event emitter use wildcards.
      delimiter: '::::', // the delimiter used to segment namespaces, defaults to `.`.
      maxListeners: 20 // the max number of listeners that can be assigned to an event, defaults to 10.
    };

    emitter = new EventEmitter2(config);

    emitter.removeAllListeners();

    expect(emitter._maxListeners).toBe(config.maxListeners);

    expect(emitter._conf.maxListeners).toBe(config.maxListeners);
    expect(emitter._conf.delimiter).toBe(config.delimiter);
    expect(emitter._conf.wildcard).toBe(config.wildcard);
  });

  it('reconfigure2. setMaxListeners, removeAllListeners', () => {
    let emitter;
    const amount = 99;

    emitter = new EventEmitter2();

    emitter.setMaxListeners(amount);

    emitter.removeAllListeners();

    expect(emitter._maxListeners).toBe(amount);

    expect(emitter._conf.maxListeners).toBe(amount);
  });

  it('getMaxListeners', () => {
    const emitter = new EventEmitter2();
    let amount = 10; // default amount

    expect(emitter.getMaxListeners()).toBe(amount);

    amount = 99;

    emitter.setMaxListeners(amount);

    expect(emitter.getMaxListeners()).toBe(amount);
  });

  it('defaultMaxListeners', () => {
    const defaultAmount = 10;
    let amount = defaultAmount;

    expect(EventEmitter2.defaultMaxListeners).toBe(amount);
    amount = 99;
    EventEmitter2.defaultMaxListeners = amount;
    expect(EventEmitter2.defaultMaxListeners).toBe(amount);
    EventEmitter2.defaultMaxListeners = defaultAmount; // rollback
  });
});
