var assert = require('assert');
var EventEmitter = require('events').EventEmitter;
var file = '../../lib/eventemitter2';
var EventEmitter2;

if (typeof require !== 'undefined') {
    EventEmitter2 = require(file).EventEmitter2;
} else {
    EventEmitter2 = window.EventEmitter2;
}

module.exports = {
    '1. should listen events': function () {
        var isEmitted= false;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2();

        ee2.listenTo(ee, 'test');

        ee2.on('test', function () {
            isEmitted = true;
        });

        ee.emit('test');

        assert.equal(isEmitted, true);
    },

    '2. should attach listeners to the target object on demand if newListener & removeListener options activated': function () {
        var isEmitted= false;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2({
            newListener: true,
            removeListener: true
        });

        ee2.listenTo(ee, {
            'foo': 'bar'
        });

        assert.equal(ee.listenerCount('foo'), 0);

        ee2.on('bar', function () {
            isEmitted = true;
        });

        assert.equal(ee.listenerCount('foo'), 1);

        ee.emit('foo');


        assert.equal(isEmitted, true);
    },

    '3. should handle listener data': function () {
        var isEmitted= false;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2();

        ee2.listenTo(ee, 'test');

        ee2.on('test', function (a, b, c) {
            isEmitted = true;
            assert.equal(a, 1);
            assert.equal(b, 2);
            assert.equal(c, 3);
        });

        assert.equal(ee.listenerCount('test'), 1);

        ee.emit('test', 1, 2, 3);

        assert.equal(isEmitted, true);
    },

    '4. should support stopListeningTo method': function () {
        var counter= 0;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2();

        ee2.listenTo(ee, 'test');

        ee2.on('test', function () {
            counter++;
        });

        assert.equal(ee.listenerCount('test'), 1);

        ee.emit('test');
        ee.emit('test');

        ee2.stopListeningTo(ee);

        ee.emit('test');

        assert.equal(counter, 2);
        assert.equal(ee.listenerCount('test'), 0);
    },

    '5. should support listening of multiple events': function () {
        var emitted1= false;
        var emitted2= false;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2();

        ee2.listenTo(ee, 'test1 test2');

        ee2.on('test1', function () {
            emitted1= true;
        });

        ee2.on('test2', function () {
            emitted2= true;
        });

        assert.equal(ee.listenerCount('test1'), 1);
        assert.equal(ee.listenerCount('test2'), 1);

        ee.emit('test1');
        ee.emit('test2');

        assert.equal(emitted1, true);
        assert.equal(emitted2, true);
    },

    '6. should support events mapping': function () {
        var emitted1= false;
        var emitted2= false;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2();

        ee2.listenTo(ee, {
            test1: 'foo',
            test2: 'bar'
        });

        ee2.on('foo', function (x) {
            emitted1= true;
            assert.equal(x, 1);
        });

        ee2.on('bar', function (y) {
            emitted2= true;
            assert.equal(y, 2);
        });

        assert.equal(ee.listenerCount('test1'), 1);
        assert.equal(ee.listenerCount('test2'), 1);

        ee.emit('test1', 1);
        ee.emit('test2', 2);

        assert.equal(emitted1, true);
        assert.equal(emitted2, true);
    },

    '7. should support event reducer': function () {
        var counter1= 0;
        var counter2= 0;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2();

        ee2.listenTo(ee, {
            test1: 'foo',
            test2: 'bar'
        }, {
            reducers: {
                test1: function(event){
                    assert.equal(event.name, 'foo');
                    return event.data[0]!=='ignoreTest';
                },

                test2: function(event){
                    assert.equal(event.name, 'bar');
                    event.data[0]= String(event.data[0]);
                }
            }
        });

        ee2.on('foo', function (x) {
            counter1++;
            assert.equal(x, 456);
        });

        ee2.on('bar', function (y) {
            counter2++;
            assert.equal(y, '123');
        });

        ee.emit('test1', 'ignoreTest');
        ee.emit('test1', 456);
        ee.emit('test2', 123);
        ee.emit('test2', 123);

        assert.equal(counter1, 1);
        assert.equal(counter2, 2);
    },

    '8. should support a single reducer for multiple events': function () {
        var counter1= 0;
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2();

        ee2.listenTo(ee, {
            test1: 'foo',
            test2: 'bar'
        }, {
            reducers: function(){
                counter1++;
            }
        });

        ee.emit('test1');
        ee.emit('test2');

        assert.equal(counter1, 2);
    },

    '9. should detach the listener from the target when the last listener was removed from the emitter': function () {
        var ee = new EventEmitter();
        var ee2 = new EventEmitter2({
            newListener: true,
            removeListener: true
        });

        ee2.listenTo(ee, {
            'foo': 'bar'
        });

        assert.equal(ee.listenerCount('foo'), 0);

        var handler= function(){};

        ee2.on('bar', handler);

        assert.equal(ee.listenerCount('foo'), 1);

        ee2.off('bar', handler);

        assert.equal(ee.listenerCount('foo'), 0);
    }
};
