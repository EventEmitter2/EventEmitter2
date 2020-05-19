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
    'should remove all wildcard events': function(){
        var counter=0;

        var ee= new EventEmitter2({
            wildcard: true
        });

        ee.on('test.*', function(){
            counter++;
        });

        assert.equal(ee.listenerCount('test.*'), 1);

        ee.emit('test.foo');

        assert.equal(counter, 1);
        ee.removeAllListeners();

        assert.equal(ee.listenerCount('test.*'), 0);
    }
};
