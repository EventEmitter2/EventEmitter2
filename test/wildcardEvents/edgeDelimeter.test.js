import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('edgeDelimeter Tests', () => {
  it('1. delimeter at the start', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const spy = vi.fn();
    emitter.on('.ns1.ns2', spy);

    emitter.emit('.ns1.ns2');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('2. delimeter at the middle', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const spy = vi.fn();
    emitter.on('ns1..ns3', spy);

    emitter.emit('ns1..ns3');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('3. delimeter at the end', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const spy = vi.fn();
    emitter.on('ns1.ns2.', spy);

    emitter.emit('ns1.ns2.');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('4. custome delimeter at the start', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      delimeter: '/'
    });

    const spy = vi.fn();
    emitter.on('/ns1/ns2', spy);

    emitter.emit('/ns1/ns2');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('5. custome delimeter at the middle', () => {
    const emitter = new EventEmitter2({
      wildcard: true,
      delimeter: '/'
    });

    const spy = vi.fn();
    emitter.on('ns1//ns3', spy);

    emitter.emit('ns1//ns3');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('6. custome delimeter at the end', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const spy = vi.fn();
    emitter.on('ns1/ns2/', spy);

    emitter.emit('ns1/ns2/');

    // Original expected 1 assertion
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
