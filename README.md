
# EventEmitter2

EventEmitter2 is a an implementation of the EventEmitter found in Node.js


## Features

 - Namespaced events
 - Wildcards for namespaces
 - Times To Listen (TTL), extends the `once` concept
 - Browser environment compatibility
 - As good or better performance for emission and listener registration as Node.js core EventEmitter
 - Smaller. EventEmitter2.js (2.2K Minified) VS. events.js (2.7K Minified)

## Differences (Non breaking, compatible with existing EventEmitter)

 - The constructor takes a configuration object.
 
```javascript
   var server = EventEmitter2({
     delimiter: '/', // the delimiter used to segment namespaces, defaults to `.`.
     maxListeners: 20 // the max number of listeners that can be assigned to an event, defaults to 10.
   });
```

 - The first parameter of a listener is the actual event name that the listener reacted to (because of wildcards).

```javascript
    server.on('foo.*', function(event, value1, value2) {
      console.log('a values were', value1, value2);
    });
```

 - A new method was adde. Times to listen, an extension of the `once` concept.

```javascript
    server.many('foo', 4, function(event, value1, value2) {
      console.log('a values were', value1, value2);
    });
```


## API

When an `EventEmitter` instance experiences an error, the typical action is
to emit an `error` event. Error events are treated as a special case.
If there is no listener for it, then the default action is to print a stack
trace and exit the program.

All EventEmitters emit the event `newListener` when new listeners are
added.


#### emitter.addListener(event, listener)
#### emitter.on(event, listener)

Adds a listener to the end of the listeners array for the specified event.

```javascript
    server.on('data', function(value) {
      console.log('The event was raised!');
    });
```

```javascript
    server.on('data', function(value) {
      console.log('This event will be listened to exactly four times.');
    });
```


#### emitter.once(event, listener)

Adds a **one time** listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.

```javascript
    server.once('get', function (value) {
      console.log('Ah, we have our first value!');
    });
```

#### emitter.many(event, timesToListen, listener)

Adds a listener that will execute **n times** for the event before being removed. The listener is invoked only the first time the event is fired, after which it is removed.

```javascript
    server.many('get', 4, function (value) {
      console.log('Ah, we have our first value!');
    });
```


#### emitter.removeListener(event, listener)

Remove a listener from the listener array for the specified event. **Caution**: changes array indices in the listener array behind the listener.

```javascript
    var callback = function(value) {
      console.log('someone connected!');
    };
    server.on('get', callback);
    // ...
    server.removeListener('get', callback);
```


#### emitter.removeAllListeners([event])

Removes all listeners, or those of the specified event.


#### emitter.setMaxListeners(n)

By default EventEmitters will print a warning if more than 10 listeners are added to it. This is a useful default which helps finding memory leaks. Obviously not all Emitters should be limited to 10. This function allows that to be increased. Set to zero for unlimited.


#### emitter.listeners(event)

Returns an array of listeners for the specified event. This array can be manipulated, e.g. to remove listeners.

```javascript
    server.on('get', function (value) {
      console.log('someone connected!');
    });
    console.log(console.log(server.listeners('get')); // [ [Function] ]
```

#### emitter.emit(event, [arg1], [arg2], [...])

Execute each of the listeners in order with the list of arguments.

## Test coverage

There is a test suite that tries to cover each use case, it can be found <a href="https://github.com/hij1nx/EventEmitter2/tree/master/test">here</a>.

## Licence

(The MIT License)

Copyright (c) 2011 hij1nx <http://www.twitter.com/hij1nx>, indexzero <http://www.twitter.com/indexzero>, Fedor Indutny <http://www.twitter.com/indutny>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
