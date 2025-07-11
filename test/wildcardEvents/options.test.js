import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('options Tests', () => {
  it('intialize 1. Configuration Flags Test.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const emitterDefault = new EventEmitter2({});

    expect(emitterDefault.wildcard).toBeUndefined();
    expect(emitter.wildcard).toBe(true);
  });

  it('initialize 2. creating a wildcard EE should have listenerTree.', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      verbose: true
    });

    const emitterDefault = new EventEmitter2({});

    expect(emitter.listenerTree).toBeDefined();
    expect(typeof emitter.listenerTree).toBe('object');
    expect(emitterDefault.listenerTree).toBeUndefined();
    // check the tree to be empty?
  });
});
