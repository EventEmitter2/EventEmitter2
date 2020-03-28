var BBPromise = require("bluebird");
var simpleEvents = require('nodeunit').testCase;
var file = '../../lib/eventemitter2';
var EventEmitter2;

BBPromise.config({
    cancellation: true
});

if (typeof require !== 'undefined') {
    EventEmitter2 = require(file).EventEmitter2;
} else {
    EventEmitter2 = window.EventEmitter2;
}

module.exports = simpleEvents({
    '1. should return a Promise': function (test) {
        var ee = new EventEmitter2();
        var result = EventEmitter2.once(ee, 'event');
        test.ok(result instanceof Promise);
        test.done();
    },

    '2. should resolve the promise when a specific event occurs': function (test) {
        var ee = new EventEmitter2();
        var timer = setTimeout(function () {
            throw Error('timeout');
        }, 100);
        EventEmitter2.once(ee, 'event').then(function () {
            clearTimeout(timer);
            test.done();
        }, function (err) {
            clearTimeout(timer);
            throw err;
        });
        ee.emit('event');
    },

    '3. should handle the event data arguments as an array': function (test) {
        var ee = new EventEmitter2();
        EventEmitter2.once(ee, 'event').then(function (data) {
            test.deepEqual(data, [1, 2, 3]);
            test.done();
        }, function (err) {
            throw err;
        });
        ee.emit('event', 1, 2, 3);
    },

    '4. should reject the promise if an error event emitted': function (test) {
        var ee = new EventEmitter2();
        var message = 'test';
        var timer = setTimeout(function () {
            throw Error('timeout');
        }, 100);
        EventEmitter2.once(ee, 'event').then(function () {
            clearTimeout(timer);
            throw Error('unexpected promise resolving');
        }, function (err) {
            clearTimeout(timer);
            test.equal(err.message, message);
            test.done();
        });
        ee.emit('error', new Error(message));
    },

    '5. should support cancellation': function (test) {
        var ee = new EventEmitter2();
        var message = 'canceled';

        var timer = setTimeout(function () {
            throw Error('test timeout');
        }, 100);
        var promise = EventEmitter2.once(ee, 'event');

        promise.then(function () {
            clearTimeout(timer);
            throw Error('unexpected promise resolving');
        }, function (err) {
            clearTimeout(timer);
            test.equal(err.message, message);
            test.done();
        });

        setTimeout(function () {
            promise.cancel();
        }, 50);
    },

    '6. should support timeout handling': function (test) {
        var ee = new EventEmitter2();
        var message = 'timeout';

        var timer = setTimeout(function () {
            throw Error('test timeout');
        }, 100);

        var promise = EventEmitter2.once(ee, 'event', {
            timeout: 10
        });

        promise.then(function () {
            clearTimeout(timer);
            throw Error('unexpected promise resolving');
        }, function (err) {
            clearTimeout(timer);
            test.equal(err.message, message);
            test.done();
        });
    },


    '7. should support BlueBird promises': function (test) {
        var ee = new EventEmitter2();

        EventEmitter2.once(ee, 'event', {
            Promise: BBPromise
        }).then(function (data) {
            test.deepEqual(data, [1, 2, 3]);
            test.done();
        }, function (err) {
            throw err;
        });
        ee.emit('event', 1, 2, 3);
    },

    '8. should support BlueBird promise silent cancellation': function (test) {
        var ee = new EventEmitter2();

        var bbPromise= EventEmitter2.once(ee, 'event', {
            Promise: BBPromise
        }).then(function () {
            throw Error('unexpected promise resolving');
        }, function () {
            throw Error('unexpected promise rejecting');
        });

        bbPromise.cancel();
        ee.emit('event');

        setTimeout(function(){
            test.done();
        }, 50);
    },

    '9. should support overloading cancellation api': function (test) {
        var ee = new EventEmitter2();
        var message= 'canceled';

        var bbPromise= EventEmitter2.once(ee, 'event', {
            Promise: BBPromise,
            overload: true
        });

        bbPromise.then(function () {
            throw Error('unexpected promise resolving');
        }, function (err) {
            test.equal(err.message, message);
            test.done();
        });

        bbPromise.cancel();
    }
});
