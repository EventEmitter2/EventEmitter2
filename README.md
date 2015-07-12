[![build-status](https://www.codeship.io/projects/925d6000-09fc-0133-3120-36ea30c979a9/status)](https://www.codeship.io/projects/90643)

[![NPM version](https://badge.fury.io/js/Reventer.png)](http://badge.fury.io/js/Reventer)

# SYNOPSIS

Reventer is a fork of the [EventEmitter2 project](https://github.com/asyncly/EventEmitter2) that fixes the onAny method to no longer use this as a reference and properly use AMD/CommonJS packaging.

Credits to [hij1nx](http://www.twitter.com/hij1nx) the original author and maintainer of EventEmitter2.

# DESCRIPTION

### FEATURES
 - Namespaces/Wildcards.
 - Times To Listen (TTL), extends the `once` concept with `many`.
 - Browser environment compatibility.
 - Demonstrates good performance in benchmarks

### Differences (Non breaking, compatible with existing EventEmitter)

 - The constructor takes a configuration object.

```javascript
    var Reventer = require('Reventer');
    var server = new Reventer({

      //
      // use wildcards.
      //
      wildcard: true,

      //
      // the delimiter used to segment namespaces, defaults to `.`.
      //
      delimiter: '::',

      //
      // if you want to emit the newListener event set to true.
      //
      newListener: false,

      //
      // max listeners that can be assigned to an event, default 10.
      //
      maxListeners: 20
    });
```

 - Getting the actual event that fired.

```javascript
    server.on('foo.*', function(value1, value2) {
      console.log(this.event, value1, value2);
    });
```

 - Fire an event N times and then remove it, an extension of the `once` concept.

```javascript
    server.many('foo', 4, function() {
      console.log('hello');
    });
```

 - Pass in a namespaced event as an array rather than a delimited string.

```javascript
    server.many(['foo', 'bar', 'bazz'], function() {
      console.log('hello');
    });
```


# API

When an `EventEmitter` instance experiences an error, the typical action is
to emit an `error` event. Error events are treated as a special case.
If there is no listener for it, then the default action is to print a stack
trace and exit the program.

All EventEmitters emit the event `newListener` when new listeners are
added.


**Namespaces** with **Wildcards**
To use namespaces/wildcards, pass the `wildcard` option into the EventEmitter
constructor. When namespaces/wildcards are enabled, events can either be
strings (`foo.bar`) separated by a delimiter or arrays (`['foo', 'bar']`). The
delimiter is also configurable as a constructor option.

An event name passed to any event emitter method can contain a wild card (the
`*` character). If the event name is a string, a wildcard may appear as `foo.*`.
If the event name is an array, the wildcard may appear as `['foo', '*']`.

If either of the above described events were passed to the `on` method,
subsequent emits such as the following would be observed...

```javascript
   emitter.emit('foo.bazz');
   emitter.emit(['foo', 'bar']);
```


### emitter.addListener(event, listener)
### emitter.on(event, listener)

Adds a listener to the end of the listeners array for the specified event.

```javascript
    server.on('data', function(value1, value2, value3, ...) {
      console.log('The event was raised!');
    });
```

```javascript
    server.on('data', function(value) {
      console.log('The event was raised!');
    });
```

### emitter.onAny(listener)

Adds a listener that will be fired when any event is emitted.

```javascript
    server.onAny(function(event, value) {
      console.log('All events trigger this.');
    });
```

### emitter.offAny(listener)

Removes the listener that will be fired when any event is emitted.

```javascript
    server.offAny(function(value) {
      console.log('The event was raised!');
    });
```

#### emitter.once(event, listener)

Adds a **one time** listener for the event. The listener is invoked
only the first time the event is fired, after which it is removed.

```javascript
    server.once('get', function (value) {
      console.log('Ah, we have our first value!');
    });
```

### emitter.many(event, timesToListen, listener)

Adds a listener that will execute **n times** for the event before being
removed. The listener is invoked only the first **n times** the event is
fired, after which it is removed.

```javascript
    server.many('get', 4, function (value) {
      console.log('This event will be listened to exactly four times.');
    });
```


### emitter.removeListener(event, listener)
### emitter.off(event, listener)

Remove a listener from the listener array for the specified event.
**Caution**: changes array indices in the listener array behind the listener.

```javascript
    var callback = function(value) {
      console.log('someone connected!');
    };
    server.on('get', callback);
    // ...
    server.removeListener('get', callback);
```


### emitter.removeAllListeners([event])

Removes all listeners, or those of the specified event.


### emitter.setMaxListeners(n)

By default EventEmitters will print a warning if more than 10 listeners
are added to it. This is a useful default which helps finding memory leaks.
Obviously not all Emitters should be limited to 10. This function allows
that to be increased. Set to zero for unlimited.


### emitter.listeners(event)

Returns an array of listeners for the specified event. This array can be
manipulated, e.g. to remove listeners.

```javascript
    server.on('get', function(value) {
      console.log('someone connected!');
    });
    console.log(server.listeners('get')); // [ [Function] ]
```

### emitter.listenersAny()

Returns an array of listeners that are listening for any event that is
specified. This array can be manipulated, e.g. to remove listeners.

```javascript
    server.onAny(function(event, value) {
      console.log('someone connected!');
    });
    console.log(server.listenersAny()[0]); // [ [Function] ]
```

### emitter.emit(event, [arg1], [arg2], [...])

Execute each of the listeners that may be listening for the specified event
name in order with the list of arguments.

# LICENSE

(The MIT License)

Copyright (c) 2011 hij1nx <http://www.twitter.com/hij1nx>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
