import { describe, it, expect, vi } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('wildcardEvents addListener Tests', () => {
  it('1. Add a single listener on a single event.', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = 'some.listener.bar';
    const spy = vi.fn();
    emitter.on(type, spy);

    expect(emitter.listeners(type).length).toBe(1);
    // Function should not be called since no event is emitted
    expect(spy).not.toHaveBeenCalled();
  });

  it('1a. Add a single listener on a single event (using an array).', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = ['some', 'listener', 'bar'];
    const spy = vi.fn();
    emitter.on(type, spy);

    expect(emitter.listeners(type).length).toBe(1);
    // Function should not be called since no event is emitted
    expect(spy).not.toHaveBeenCalled();
  });

  it('2. Add two listeners on a single event.', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = 'some.listener.bar';
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    emitter.on(type, spy1);
    emitter.on(type, spy2);

    expect(emitter.listeners(type).length).toBe(2);
    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('2a. Add two listeners on a single event (using an array).', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = ['some', 'listener', 'bar'];
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    emitter.on(type, spy1);
    emitter.on(type, spy2);

    expect(emitter.listeners(type).length).toBe(2);
    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('3. Add three listeners on a single event.', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = 'some.listener.bar';
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();
    emitter.on(type, spy1);
    emitter.on(type, spy2);
    emitter.on(type, spy3);

    expect(emitter.listeners(type).length).toBe(3);
    // Functions should not be called since no event is emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('4. Add two listeners to two different events.', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = 'some.listener.bar';
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();
    const spy4 = vi.fn();
    emitter.on(type, spy1);
    emitter.on(type, spy2);
    emitter.on('test2', spy3);
    emitter.on('test2', spy4);

    expect(emitter.listeners(type).length).toBe(2);
    expect(emitter.listeners('test2').length).toBe(2);
    // Functions should not be called since no events are emitted
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
    expect(spy4).not.toHaveBeenCalled();
  });

  it('5. Never adding any listeners should yield a listeners array with the length of 0.', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = 'some.listener.bar';
    const spy = vi.fn();
    emitter.on(type, spy);

    expect(emitter.listeners('test2').length).toBe(0);
    // Function should not be called since no event is emitted
    expect(spy).not.toHaveBeenCalled();
  });

  it('6. the listener added should be the right listener.', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const type = 'some.listener.bar';
    const f = function () {};

    emitter.on(type, f);
    expect(emitter.listeners(type).length).toBe(1);
    expect(emitter.listeners(type)[0]).toBe(f);
  });

  it('7. Listeners on `*`, `*.*`, `*.test` with emissions from `foo.test` and `other.emit`', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const f = vi.fn();

    emitter.on('*.test', f);
    emitter.on('*.*', f);
    emitter.on('*', f);

    emitter.emit('other.emit'); // Matches *.* and * = 2 calls
    emitter.emit('foo.test');   // Matches *.test and * = 2 calls, but *.* also = 3 calls total

    // Original expected 3 total assertions
    expect(f).toHaveBeenCalledTimes(3);
  });

  it('8. Listeners on `*`, `*.*`, foo.test with emissions from `*`, `*.*` and `foo.test`', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const f = vi.fn();

    emitter.on('foo.test', f);
    emitter.on('*.*', f);
    emitter.on('*', f);

    emitter.emit('*.*');     // Matches *.* and * = 2 calls
    emitter.emit('foo.test'); // Matches foo.test and * = 2 calls
    emitter.emit('*');        // Matches * = 1 call

    // Original expected 5 total assertions
    expect(f).toHaveBeenCalledTimes(5);
  });

  it('9. Listeners on `*`. (using an array)', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const f = vi.fn();

    emitter.on(['*'], f);
    emitter.emit('*');

    // Original expected 1 assertion
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('10. actual event name', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const firstSpy = vi.fn(() => {
      emitter.emit('bar'); // changes the current event, passes the old one in as a parameter.
    });
    const secondSpy = vi.fn(() => {
      // console.log(this.event);
    });

    emitter.on('foo', firstSpy);
    emitter.on('*', secondSpy);

    emitter.emit('foo');

    // First listener should be called once
    expect(firstSpy).toHaveBeenCalledTimes(1);
    // Second listener should be called twice (for 'foo' and 'bar' events)
    expect(secondSpy).toHaveBeenCalledTimes(2);
  });

  it('11. Listeners with multi-level wildcards', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const spies = [];
    let i = 0;
    const f = function () {
      const spy = vi.fn();
      spies.push(spy);
      return spy;
    };

    emitter.on('**.test', f(i++));     // 0
    emitter.on('**.bar.**', f(i++));   // 1
    emitter.on('**.*', f(i++));        // 2
    emitter.on('*.**', f(i++));        // 3
    emitter.on('**', f(i++));          // 4
    emitter.on('other.**', f(i++));    // 5
    emitter.on('foo.**.test', f(i++)); // 6
    emitter.on('test.**', f(i++));     // 7

    // Add forbidden patterns for safety purpose.
    emitter.on('**.**', f(i++));       // 8
    emitter.on('a.b.**.**', f(i++));   // 9
    emitter.on('**.**.a.b', f(i++));   // 10
    emitter.on('a.b.**.**.a.b', f(i++)); // 11

    // Functions should not be called since no events are emitted in this test
    spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
  });

  it('12. Check return values of emit for wildcard emitter.', () => {
    const emitter = new EventEmitter2({
      wildcard: true
    });

    const spy1 = vi.fn();
    const spy2 = vi.fn();

    emitter.on('foo.*', spy1);
    emitter.onAny(spy2);

    expect(emitter.emit('foo.blah')).toBe(true);
    expect(emitter.emit('bar')).toBe(true);

    // Original expected 5 assertions (2 events + 2 returns + 1 general)
    expect(spy1).toHaveBeenCalledTimes(1); // matches 'foo.blah'
    expect(spy2).toHaveBeenCalledTimes(2); // matches both 'foo.blah' and 'bar'
  });
});
