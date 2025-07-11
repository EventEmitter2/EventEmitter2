
import { describe, it, expect } from 'vitest';
import { EventEmitter2 } from '../../lib/eventemitter2.js';

describe('K1 Tests', () => {
  it('should handle wildcard and multi-level wildcard events', () => {
    const e = new EventEmitter2({ wildcard: true });
    let countWildcard = 0;
    let counMultiLevelWildcard = 0;
    let countAny = 0;

    e.on('foo', () => {
      e.emit('bar', 'bar');
    });
    e.on('*', function(name) {
      ++countWildcard;
      console.log(this.event, name);
      expect(this.event).toBe(name);
    });
    e.on('**', function(name) {
      ++counMultiLevelWildcard;
      console.log(this.event, name);
      expect(this.event).toBe(name);
    });
    e.onAny(function(name) {
      ++countAny;
      expect(this.event).toBe(name);
    });

    e.emit('foo', 'foo');

    expect(countWildcard).toBe(2);
    expect(counMultiLevelWildcard).toBe(2);
    expect(countAny).toBe(2);
  });
});
