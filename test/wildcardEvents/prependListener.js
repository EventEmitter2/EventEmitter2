var assert= require('assert');

var file = '../../lib/eventemitter2';
var EventEmitter2;

if(typeof require !== 'undefined') {
    EventEmitter2 = require(file).EventEmitter2;
}
else {
    EventEmitter2 = window.EventEmitter2;
}

module.exports= {
    'use prepend on wildcards mode': function(){
        var ee = new EventEmitter2({
            wildcard: true
        });
        var type = ['some', 'listener', 'bar'];
        const function1 = function () {}
        const function2 = function () {}

        ee.on(type, function2);
        ee.prependListener(type, function1);
        assert.deepStrictEqual(ee.listeners(type), [function1, function2])
    }
};
