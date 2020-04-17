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
    'should normalize event name when emitting an event': function(){
        var ee= new EventEmitter2({
            wildcard: true
        });

        var counter= 0;

        ee.on('**', function(){
            assert.ok(typeof this.event==='string');
            assert.equal(this.event, 'event.test');
            counter++;
        });

        ee.emit('event.test');
        ee.emit(['event', 'test']);
        assert.equal(counter, 2, 'event not fired');
    },

    'should normalize event name when emitting an event in async mode': function(){
        var ee= new EventEmitter2({
            wildcard: true
        });

        var counter= 0;

        ee.on('**', function(){
            assert.ok(typeof this.event==='string');
            assert.equal(this.event, 'event.test');
            counter++;
        });

        return Promise.all([
            ee.emitAsync('event.test'),
            ee.emitAsync(['event', 'test'])
        ]).then(function(){
            assert.equal(counter, 2, 'event not fired');
        });
    },

    'should not convert ns to a string if ns is an array and contains a symbol': function(){
        var ee= new EventEmitter2({
            wildcard: true
        });
        var symbol= Symbol('test');
        var counter= 0;

        ee.on('**', function(){
            assert.ok(Array.isArray(this.event));
            assert.deepEqual(this.event, ['event', symbol]);
            counter++;
        });

        ee.emit(['event', symbol]);
        assert.equal(counter, 1, 'event not fired');
    },

    'should not convert ns to a string if ns is an array and contains a symbol while emitting in async mode': function(){
        var ee= new EventEmitter2({
            wildcard: true
        });
        var symbol= Symbol('test');
        var counter= 0;

        ee.on('**', function(){
            assert.ok(Array.isArray(this.event));
            assert.deepEqual(this.event, ['event', symbol]);
            counter++;
        });

        return Promise.all([
            ee.emit(['event', symbol])
        ]).then(function(){
            assert.equal(counter, 1, 'event not fired');
        });
    }
};
