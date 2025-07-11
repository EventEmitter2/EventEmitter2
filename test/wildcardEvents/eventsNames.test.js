import { describe, it, expect } from 'vitest';
import EventEmitter2 from '../../lib/eventemitter2.js';


describe('eventsNames Tests', () => {
  it('1. should return wildcard events namespaces', () => {
    const symbol = Symbol('test');

    const ee = new EventEmitter2({
      wildcard: true
    });

    let listener;

    ee.on('a.b.c', () => {});
    ee.on('a.b.d', listener = function() {});
    ee.on('z.*', () => {});
    ee.on(['a', 'b', symbol], () => {});

    expect(ee.eventNames()).toEqual([ 'z.*', [ 'a', 'b', symbol ], 'a.b.d', 'a.b.c' ]);

    ee.off('a.b.d', listener);

    expect(ee.eventNames()).toEqual([ 'z.*', [ 'a', 'b', symbol ], 'a.b.c' ]);
  });

  it('2. should return wildcard events namespaces as array if asArray option was set', () => {
    const symbol = Symbol('test');

    const ee = new EventEmitter2({
      wildcard: true
    });

    let listener;

    ee.on('a.b.c', () => {});
    ee.on('a.b.d', listener = function() {});
    ee.on('z.*', () => {});
    ee.on(['a', 'b', symbol], () => {});

    expect(ee.eventNames(true)).toEqual([ ['z', '*'], [ 'a', 'b', symbol ], ['a', 'b', 'd'], ['a', 'b', 'c'] ]);

    ee.off('a.b.d', listener);

    expect(ee.eventNames(true)).toEqual([ ['z', '*'], [ 'a', 'b', symbol ], ['a', 'b', 'c'] ]);
  });
});
