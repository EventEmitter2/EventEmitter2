import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';
import EventEmitter from 'events';


describe('listenTo Tests', () => {
  it('1. should listen events', () => {
    let isEmitted = false;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2();

    ee2.listenTo(ee, 'test');

    ee2.on('test', () => {
      isEmitted = true;
    });

    ee.emit('test');

    expect(isEmitted).toBe(true);
  });

  it('2. should attach listeners to the target object on demand if newListener & removeListener options activated', () => {
    let isEmitted = false;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2({
      newListener: true,
      removeListener: true
    });

    ee2.listenTo(ee, {
      'foo': 'bar'
    });

    expect(ee.listenerCount('foo')).toBe(0);

    ee2.on('bar', () => {
      isEmitted = true;
    });

    expect(ee.listenerCount('foo')).toBe(1);

    ee.emit('foo');

    expect(isEmitted).toBe(true);
  });

  it('3. should handle listener data', () => {
    let isEmitted = false;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2();

    ee2.listenTo(ee, 'test');

    ee2.on('test', (a, b, c) => {
      isEmitted = true;
      expect(a).toBe(1);
      expect(b).toBe(2);
      expect(c).toBe(3);
    });

    expect(ee.listenerCount('test')).toBe(1);

    ee.emit('test', 1, 2, 3);

    expect(isEmitted).toBe(true);
  });

  it('4. should support stopListeningTo method', () => {
    let counter = 0;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2();

    ee2.listenTo(ee, 'test');

    ee2.on('test', () => {
      counter++;
    });

    expect(ee.listenerCount('test')).toBe(1);

    ee.emit('test');
    ee.emit('test');

    ee2.stopListeningTo(ee);

    ee.emit('test');

    expect(counter).toBe(2);
    expect(ee.listenerCount('test')).toBe(0);
  });

  it('5. should support listening of multiple events', () => {
    let emitted1 = false;
    let emitted2 = false;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2();

    ee2.listenTo(ee, 'test1 test2');

    ee2.on('test1', () => {
      emitted1 = true;
    });

    ee2.on('test2', () => {
      emitted2 = true;
    });

    expect(ee.listenerCount('test1')).toBe(1);
    expect(ee.listenerCount('test2')).toBe(1);

    ee.emit('test1');
    ee.emit('test2');

    expect(emitted1).toBe(true);
    expect(emitted2).toBe(true);
  });

  it('6. should support events mapping', () => {
    let emitted1 = false;
    let emitted2 = false;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2();

    ee2.listenTo(ee, {
      test1: 'foo',
      test2: 'bar'
    });

    ee2.on('foo', (x) => {
      emitted1 = true;
      expect(x).toBe(1);
    });

    ee2.on('bar', (y) => {
      emitted2 = true;
      expect(y).toBe(2);
    });

    expect(ee.listenerCount('test1')).toBe(1);
    expect(ee.listenerCount('test2')).toBe(1);

    ee.emit('test1', 1);
    ee.emit('test2', 2);

    expect(emitted1).toBe(true);
    expect(emitted2).toBe(true);
  });

  it('7. should support event reducer', () => {
    let counter1 = 0;
    let counter2 = 0;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2();

    ee2.listenTo(ee, {
      test1: 'foo',
      test2: 'bar'
    }, {
      reducers: {
        test1(event) {
          expect(event.name).toBe('foo');
          return event.data[0] !== 'ignoreTest';
        },

        test2(event) {
          expect(event.name).toBe('bar');
          event.data[0] = String(event.data[0]);
        }
      }
    });

    ee2.on('foo', (x) => {
      counter1++;
      expect(x).toBe(456);
    });

    ee2.on('bar', (y) => {
      counter2++;
      expect(y).toBe('123');
    });

    ee.emit('test1', 'ignoreTest');
    ee.emit('test1', 456);
    ee.emit('test2', 123);
    ee.emit('test2', 123);

    expect(counter1).toBe(1);
    expect(counter2).toBe(2);
  });

  it('8. should support a single reducer for multiple events', () => {
    let counter1 = 0;
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2();

    ee2.listenTo(ee, {
      test1: 'foo',
      test2: 'bar'
    }, {
      reducers() {
        counter1++;
      }
    });

    ee.emit('test1');
    ee.emit('test2');

    expect(counter1).toBe(2);
  });

  it('9. should detach the listener from the target when the last listener was removed from the emitter', () => {
    const ee = new EventEmitter();
    const ee2 = new EventEmitter2({
      newListener: true,
      removeListener: true
    });

    ee2.listenTo(ee, {
      'foo': 'bar'
    });

    expect(ee.listenerCount('foo')).toBe(0);

    const handler = function() {};

    ee2.on('bar', handler);

    expect(ee.listenerCount('foo')).toBe(1);

    ee2.off('bar', handler);

    expect(ee.listenerCount('foo')).toBe(0);
  });
});
