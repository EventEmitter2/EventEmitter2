import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('prepend Tests', () => {
  it('1. Add a listener before another one on a single event.', () => {
    const emitter = new EventEmitter2({ verbose: true });

    let raised = false;
    const second = function () {
      expect(raised).toBeTruthy();
    };
    emitter.on('test1', second);

    const first = function () {
      expect(raised).toBeFalsy();
      raised = true;
    };
    emitter.prependListener('test1', first);

    expect(emitter.listeners('test1').length).toBe(2);
    expect(emitter.listeners('test1')[0]).toBe(first);
    expect(emitter.listeners('test1')[1]).toBe(second);
    emitter.emit('test1');
  });

  it('2. prepend listener for any event', () => {
    const emitter = new EventEmitter2({ verbose: true });

    let raised = false;
    const second = function () {
      expect(raised).toBeTruthy();
    };
    emitter.onAny(second);

    const first = function () {
      expect(raised).toBeFalsy();
      raised = true;
    };
    emitter.prependAny(first);

    emitter.emit('random');
  });
});
