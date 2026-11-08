var assert = require('assert');
var EventEmitter2 = require('../../lib/eventemitter2').EventEmitter2;
var tests = module.exports = {};

['emit', 'emitAsync'].forEach(function(method) {
    [undefined, false].forEach(function(enabled) {
        ['.', '/'].forEach(function(delimiter) {
            tests[method + ' suppresses string and array newListener with option ' + enabled + ' and delimiter ' + delimiter] = function() {
                var options = {wildcard: true, delimiter: delimiter};
                if (enabled !== undefined) options.newListener = enabled;
                var ee = new EventEmitter2(options);
                var calls = 0;
                function listener() { calls++; }
                ee.on('newListener', listener);
                ee.on('**', listener);
                ee.onAny(listener);
                calls = 0;

                var event = Object.freeze(['newListener']);
                var results = [ee[method]('newListener', 'payload'), ee[method](event, 'payload')];
                assert.strictEqual(calls, 0);
                assert.deepStrictEqual(event, ['newListener']);
                return Promise.all(results).then(function(values) {
                    assert.deepStrictEqual(values, method === 'emit' ? [false, false] : [[false], [false]]);
                });
            };
        });
    });

    tests[method + ' emits string and array newListener when enabled'] = function() {
        var ee = new EventEmitter2({wildcard: true, newListener: true});
        var calls = [];
        ee.on('newListener', function() {
            calls.push({event: this.event, args: Array.prototype.slice.call(arguments)});
            return 'named';
        });
        ee.onAny(function() { return 'any'; });
        calls = [];
        var payload = {value: 1};
        var args = [payload, 'second', 'third'];
        var results = ['newListener', ['newListener']].map(function(event) {
            return ee[method].apply(ee, [event].concat(args));
        });
        assert.deepStrictEqual(calls, [
            {event: 'newListener', args: args},
            {event: 'newListener', args: args}
        ]);
        return Promise.all(results).then(function(values) {
            assert.deepStrictEqual(values, method === 'emit' ? [true, true] : [['any', 'named'], ['any', 'named']]);
        });
    };

    tests[method + ' preserves explicit newListener listeners without wildcards'] = function() {
        var ee = new EventEmitter2({newListener: false});
        var calls = 0;
        ee.on('newListener', function(value) {
            assert.strictEqual(value, 'payload');
            calls++;
            return 'named';
        });
        var results = [ee[method]('newListener', 'payload'), ee[method](['newListener'], 'payload')];
        assert.strictEqual(calls, 2);
        return Promise.all(results).then(function(values) {
            assert.deepStrictEqual(values, method === 'emit' ? [true, true] : [['named'], ['named']]);
        });
    };

    tests[method + ' preserves ordinary, namespaced, removeListener and symbol events'] = function() {
        var symbol = Symbol('newListener');
        var events = [
            ['newListener', 'child'], ['newListener-ish'], ['removeListener'],
            [symbol], ['newListener', symbol]
        ];
        return Promise.all(events.map(function(event) {
            var ee = new EventEmitter2({wildcard: true, newListener: false, delimiter: '/'});
            var calls = 0;
            ee.on(event, function(value) {
                assert.strictEqual(value, 'payload');
                calls++;
                return 'named';
            });
            ee.onAny(function() { return 'any'; });
            var result = ee[method](event, 'payload');
            assert.strictEqual(calls, 1);
            return Promise.resolve(result).then(function(value) {
                assert.deepStrictEqual(value, method === 'emit' ? true : ['any', 'named']);
            });
        }));
    };
});
