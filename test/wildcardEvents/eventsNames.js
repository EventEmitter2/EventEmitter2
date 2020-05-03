var assert = require('assert');
var file = '../../lib/eventemitter2';
var EventEmitter2;

if (typeof require !== 'undefined') {
    EventEmitter2 = require(file).EventEmitter2;
} else {
    EventEmitter2 = window.EventEmitter2;
}

module.exports = {
    '1. should return wildcard events namespaces': function () {
        var symbol= Symbol('test');

        var ee= new EventEmitter2({
            wildcard: true
        });

        var listener;

        ee.on('a.b.c', function(){});
        ee.on('a.b.d', listener= function(){});
        ee.on('z.*', function(){});
        ee.on(['a', 'b', symbol], function(){});

        assert.deepEqual(ee.eventNames(), [ 'z.*', [ 'a', 'b', symbol ], 'a.b.d', 'a.b.c' ]);

        ee.off('a.b.d', listener);

        assert.deepEqual(ee.eventNames(), [ 'z.*', [ 'a', 'b', symbol ], 'a.b.c' ]);
    },

    '2. should return wildcard events namespaces as array if asArray option was set': function () {
        var symbol= Symbol('test');

        var ee= new EventEmitter2({
            wildcard: true
        });

        var listener;

        ee.on('a.b.c', function(){});
        ee.on('a.b.d', listener= function(){});
        ee.on('z.*', function(){});
        ee.on(['a', 'b', symbol], function(){});

        assert.deepEqual(ee.eventNames(true), [ ['z','*'], [ 'a', 'b', symbol ], ['a','b','d'], ['a','b','c']]);

        ee.off('a.b.d', listener);

        assert.deepEqual(ee.eventNames(true), [ ['z','*'], [ 'a', 'b', symbol ], ['a','b','c']]);
    }
};
