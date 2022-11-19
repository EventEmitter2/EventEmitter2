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
    'should support symbol keys for plain events': function(){
        var counter= 0;
        var ee= new EventEmitter2();
        var event= Symbol('event');
        var handler= function(){
            counter++;
        };
        ee.on(event, handler);
        assert.equal(ee.listenerCount(), 1);
        ee.emit(event);
        assert.equal(counter, 1);
        ee.off(event, handler);
        ee.emit(event);
        assert.equal(counter, 1);
        assert.equal(ee.listenerCount(), 0);
    },

    'should support symbol namespace for wildcard events': function(){
        var counter= 0;
        var symbol= Symbol('test');
        var ee= new EventEmitter2({
            wildcard: true
        });
        ee.on(['event', symbol], function(value){
            counter++;
            assert.equal(value, 123);
        });
        ee.emit(['event', symbol], 123);
        assert.equal(counter, 1);
    },

    'should log possible memory leak when max listeners is exceeded for a symbol event': async function () {
        const warnings= [];
        process.on('warning', (e) => {
          warnings.push(e);
        });
        var symbol= Symbol('event');
        var ee= new EventEmitter2({
          maxListeners: 1,
          verboseMemoryLeak: true,
        });
        ee.on(symbol, () => {});
        ee.on(symbol, () => {});
        await new Promise(res => {
          setTimeout(res, 0);
        });
        assert.ok(warnings.length > 0);
        assert.ok(warnings.find((e) => e.name === 'MaxListenersExceededWarning'));
      }
};
