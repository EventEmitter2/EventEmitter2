[![Codeship](https://img.shields.io/codeship/3ad58940-4c7d-0131-15d5-5a8cd3f550f8.svg?maxAge=2592000)]()
[![NPM version](https://badge.fury.io/js/eventemitter2.svg)](http://badge.fury.io/js/eventemitter2)
[![Dependency Status](https://img.shields.io/david/asyncly/eventemitter2.svg)](https://david-dm.org/asyncly/eventemitter2)
[![npm](https://img.shields.io/npm/dm/eventemitter2.svg?maxAge=2592000)]()

# SYNOPSIS

EventEmitter2 is an implementation of the EventEmitter module found in Node.js. In addition to having a better benchmark performance than EventEmitter and being browser-compatible, it also extends the interface of EventEmitter with additional non-breaking features.

# DESCRIPTION

### FEATURES
 - Namespaces/Wildcards.
 - Times To Listen (TTL), extends the `once` concept with `many`.
 - Browser environment compatibility.
 - Demonstrates good performance in benchmarks

```
EventEmitterHeatUp x 3,728,965 ops/sec \302\2610.68% (60 runs sampled)
EventEmitter x 2,822,904 ops/sec \302\2610.74% (63 runs sampled)
EventEmitter2 x 7,251,227 ops/sec \302\2610.55% (58 runs sampled)
EventEmitter2 (wild) x 3,220,268 ops/sec \302\2610.44% (65 runs sampled)
Fastest is EventEmitter2
```

### Differences (Non-breaking, compatible with existing EventEmitter)

 - The EventEmitter2 constructor takes an optional configuration object.
 
```javascript
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var server = new EventEmitter2({

  //
  // set this to `true` to use wildcards. It defaults to `false`.
  //
  wildcard: true,

  //
  // the delimiter used to segment namespaces, defaults to `.`.
  //
  delimiter: '::', 
  
  //
  // set this to `true` if you want to emit the newListener event. The default value is `false`.
  //
  newListener: false, 
  
  //
  // set this to `true` if you want to emit the removeListener event. The default value is `false`.
  //
  removeListener: false, 

  //
  // the maximum amount of listeners that can be assigned to an event, default 10.
  //
  maxListeners: 20,
  
  //
  // show event name in memory leak message when more than maximum amount of listeners is assigned, default false
  //
  verboseMemoryLeak: false,

  //
  // disable throwing uncaughtException if an error event is emitted and it has no listeners
  //
  ignoreErrors: false
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
server.many(['foo', 'bar', 'bazz'], 4, function() {
  console.log('hello');
});
```

# Installing

```console
$ npm install --save eventemitter2
```

# API

When an `EventEmitter` instance experiences an error, the typical action is
to emit an `error` event. Error events are treated as a special case.
If there is no listener for it, then the default action is to print a stack
trace and exit the program.

All EventEmitters emit the event `newListener` when new listeners are
added. EventEmitters also emit the event `removeListener` when listeners are
removed, and `removeListenerAny` when listeners added through `onAny` are
removed.


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

**NOTE:** An event name may use more than one wildcard. For example, 
`foo.*.bar.*` is a valid event name, and would match events such as
`foo.x.bar.y`, or `['foo', 'bazz', 'bar', 'test']` 

# Multi-level Wildcards
A double wildcard (the string `**`) matches any number of levels (zero or more) of events. So if for example `'foo.**'` is passed to the `on` method, the following events would be observed:

````javascript
emitter.emit('foo');
emitter.emit('foo.bar');
emitter.emit('foo.bar.baz');
````

On the other hand, if the single-wildcard event name was passed to the on method, the callback would only observe the second of these events.


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

### emitter.prependListener(event, listener)

Adds a listener to the beginning of the listeners array for the specified event.

```javascript
server.prependListener('data', function(value1, value2, value3, ...) {
  console.log('The event was raised!');
});
```


### emitter.onAny(listener)

Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the callback.

```javascript
server.onAny(function(event, value) {
  console.log('All events trigger this.');
});
```

### emitter.prependAny(listener)

Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the callback. The listener is added to the beginning of the listeners array

```javascript
server.prependAny(function(event, value) {
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

#### emitter.prependOnceListener(event, listener)

Adds a **one time** listener for the event. The listener is invoked 
only the first time the event is fired, after which it is removed.
The listener is added to the beginning of the listeners array

```javascript
server.prependOnceListener('get', function (value) {
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

### emitter.prependMany(event, timesToListen, listener)

Adds a listener that will execute **n times** for the event before being
removed. The listener is invoked only the first **n times** the event is 
fired, after which it is removed.
The listener is added to the beginning of the listeners array.

```javascript
server.many('get', 4, function (value) {
  console.log('This event will be listened to exactly four times.');
});
```



### emitter.removeListener(event, listener)
### emitter.off(event, listener)

Remove a listener from the listener array for the specified event. 
**Caution**: Calling this method changes the array indices in the listener array behind the listener.

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
server.onAny(function(value) {
  console.log('someone connected!');
});
console.log(server.listenersAny()[0]); // [ [Function] ]
```

### emitter.emit(event, [arg1], [arg2], [...])

Execute each of the listeners that may be listening for the specified event 
name in order with the list of arguments.

### emitter.emitAsync(event, [arg1], [arg2], [...])

Return the results of the listeners via [Promise.all](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).
Only this method doesn't work [IE](http://caniuse.com/#search=promise).

```javascript
emitter.on('get',function(i) {
  return new Promise(function(resolve){
    setTimeout(function(){
      resolve(i+3);
    },50);
  });
});
emitter.on('get',function(i) {
  return new Promise(function(resolve){
    resolve(i+2)
  });
});
emitter.on('get',function(i) {
  return Promise.resolve(i+1);
});
emitter.on('get',function(i) {
  return i+0;
});
emitter.on('get',function(i) {
  // noop
});

emitter.emitAsync('get',0)
.then(function(results){
  console.log(results); // [3,2,1,0,undefined]
});
```

### emitter.waitFor(event, [options])

Returns a thenable object (promise interface) that resolves when a specific event occurs

````javascript
emitter.waitFor('event').then(function (data) { 
    console.log(data); // ['bar']
});

emitter.emit('event', 'bar');
````

````javascript
emitter.waitFor('event', { 
    // handle first event data argument as an error (err, ...data)
    handleError: false,
    // the timeout for resolving the promise before it is rejected with an error (Error: timeout).
    timeout: 0, 
    //filter function to determine acceptable values for resolving the promise.
    filter: function(arg0, arg1){ 
        return arg0==='foo' && arg1==='bar'
    }   
}).then(function(data){
    console.log(data); // ['foo', 'bar']
});

emitter.emit('event', 'foo', 'bar')
````

````javascript
var thenable= emitter.waitFor('event');

thenable.then(null, function(error){
    console.log(error); //Error: canceled
});

thenable.cancel(); //stop listening the event and reject the promise
````

````javascript
emitter.waitFor('event', {
    handleError: true
}).then(null, function(error){
    console.log(error); //Error: custom error
});

emitter.emit('event', new Error('custom error')); // reject the promise
````
### emitter.eventNames()

Returns an array listing the events for which the emitter has registered listeners. The values in the array will be strings.

```javascript
emitter.on('foo', () => {});
emitter.on('bar', () => {});

console.log(emitter.eventNames());
// Prints: [ 'foo', 'bar' ]
```

### EventEmitter2.once(emitter, name, [options])
Basic example:
````javascript
var emitter= new EventEmitter2();

EventEmitter2.once(emitter, 'event', {
    timeout: 0,
    Promise: Promise, // a custom Promise constructor
    overload: false // overload promise cancellation api if exists with library implementation
}).then(function(data){
    console.log(data); // [1, 2, 3]
});

emitter.emit('event', 1, 2, 3);
````
With timeout option:
````javascript
EventEmitter2.once(emitter, 'event', {
    timeout: 1000
}).then(null, function(err){
    console.log(err); // Error: timeout
});
````
The library promise cancellation API:
````javascript
promise= EventEmitter2.once(emitter, 'event');
// notice: the cancel method exists only in the first promise chain
promise.then(null, function(err){
    console.log(err); // Error: canceled
});

promise.cancel();
````
Using the custom Promise class (**[bluebird.js](https://www.npmjs.com/package/bluebird)**):
````javascript
var BBPromise = require("bluebird");

EventEmitter2.once(emitter, 'event', {
    Promise: BBPromise
}).then(function(data){
    console.log(data); // [4, 5, 6]
});

emitter.emit('event', 4, 5, 6);
````

````javascript
var BBPromise = require("bluebird");

BBPromise.config({
    // if false or options.overload enabled, the library cancellation API will be used
    cancellation: true 
});

var promise= EventEmitter2.once(emitter, 'event', {
    Promise: BBPromise,
    overload: false // use bluebird cancellation API
}).then(function(data){
    // notice: never executed due to BlueBird cancellation logic
}, function(err){
    // notice: never executed due to BlueBird cancellation logic
});

promise.cancel();

emitter.emit('event', 'never handled');
````


