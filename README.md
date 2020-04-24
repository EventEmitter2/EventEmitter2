[![Build Status](https://travis-ci.com/EventEmitter2/EventEmitter2.svg?branch=master)](https://travis-ci.com/EventEmitter2/EventEmitter2)
[![Coverage Status](https://coveralls.io/repos/github/EventEmitter2/EventEmitter2/badge.svg?branch=master)](https://coveralls.io/github/EventEmitter2/EventEmitter2?branch=master)
[![NPM version](https://badge.fury.io/js/eventemitter2.svg)](http://badge.fury.io/js/eventemitter2)
[![Dependency Status](https://img.shields.io/david/asyncly/eventemitter2.svg)](https://david-dm.org/asyncly/eventemitter2)
[![npm](https://img.shields.io/npm/dm/eventemitter2.svg?maxAge=2592000)]()

# SYNOPSIS

EventEmitter2 is an implementation of the EventEmitter module found in Node.js. In addition to having a better benchmark performance than EventEmitter and being browser-compatible, it also extends the interface of EventEmitter with additional non-breaking features.

# DESCRIPTION

### FEATURES
 - Namespaces/Wildcards
 - Times To Listen (TTL), extends the `once` concept with [`many`](#emittermanyevent-timestolisten-listener)
 - The [emitAsync](#emitteremitasyncevent-arg1-arg2-) method to return the results of the listeners via Promise.all
 - Feature-rich [waitFor](#emitterwaitforevent-options) method to wait for events using promises
 - [listenTo](#listentotargetemitter-events-event--eventns-options) & [stopListening](#stoplisteningtarget-object-event--eventns-string-boolean) methods
 for listening to an external event emitter and propagate its events through itself using optional reducers/filters 
 - Extended version of the [events.once](#eventemitter2onceemitter-name-options) method from the [node events API](https://nodejs.org/api/events.html#events_events_once_emitter_name)
 - Browser & Workers environment compatibility
 - Demonstrates good performance in benchmarks

```
Platform: win32, x64, 15267MB
Node version: v13.11.0
Cpu: 4 x AMD Ryzen 3 2200U with Radeon Vega Mobile Gfx @ 2495MHz
----------------------------------------------------------------
EventEmitterHeatUp x 3,017,814 ops/sec ±3.37% (68 runs sampled)
EventEmitter x 3,357,197 ops/sec ±4.66% (62 runs sampled)
EventEmitter2 x 11,378,225 ops/sec ±3.99% (62 runs sampled)
EventEmitter2 (wild) x 4,799,373 ops/sec ±4.01% (66 runs sampled)
EventEmitter3 x 10,007,114 ops/sec ±3.94% (69 runs sampled)
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
server.on('foo.*', function() {
  console.log(this.event); 
});

server.emit('foo.bar'); // foo.bar
server.emit(['foo', 'bar']); // foo.bar

server.emit(Symbol()); // Symbol()
server.emit(['foo', Symbol()]); // ['foo', Symbol())
```
**Note**: Generally this.event is normalized to a string ('event', 'event.test'),
except the cases when event is a symbol or namespace contains a symbol. 
In these cases this.event remains as is (symbol and array). 

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
$ npm install eventemitter2
```

# API

### Types definition
- `Event`: string | symbol
- `EventNS`: string | Event []

## Class EventEmitter2

### instance:
- [emit(event: event | eventNS, ...values: any[]): boolean](#emitteremitevent-arg1-arg2-);

- [emitAsync(event: event | eventNS, ...values: any[]): Promise<any[]>](#emitteremitasyncevent-arg1-arg2-)

- [addListener(event: event | eventNS, listener: Listener, boolean|options?: object): this](#emitteraddlistenerevent-listener)

- [on(event: event | eventNS, listener: Listener, boolean|options?: object): this](#emitteraddlistenerevent-listener)

- [prependListener(event: event | eventNS, listener: Listener, boolean|options?: object): this](#emitterprependlistenerevent-listener)

- [once(event: event | eventNS, listener: Listener, boolean|options?: object): this](#emitteronceevent-listener)

- [prependOnceListener(event: event | eventNS, listener: Listener, boolean|options?: object): this](#emitterprependoncelistenerevent-listener)

- [many(event: event | eventNS, timesToListen: number, listener: Listener, boolean|options?: object): this](#emittermanyevent-timestolisten-listener)

- [prependMany(event: event | eventNS, timesToListen: number, listener: Listener, boolean|options?: object): this](#emitterprependanylistener)

- [onAny(listener: EventAndListener): this](#emitteronanylistener)

- [prependAny(listener: EventAndListener): this](#emitterprependanylistener)

- [offAny(listener: Listener): this](#emitteroffanylistener)

- [removeListener(event: event | eventNS, listener: Listener): this](#emitterremovelistenerevent-listener)

- [off(event: event | eventNS, listener: Listener): this](#emitteroffevent-listener)

- [removeAllListeners(event?: event | eventNS): this](#emitterremovealllistenersevent)

- [setMaxListeners(n: number): void](#emittersetmaxlistenersn)

- [getMaxListeners(): number](#emittergetmaxlisteners)

- [eventNames(): string[]](#emittereventnames)

- [listeners(event: event | eventNS): Listener[]](#emitterlistenersevent)

- [listenersAny(): Listener[]](#emitterlistenersany)

- [waitFor(event: event | eventNS, timeout?: number): CancelablePromise<any[]>](#emitterwaitforevent-timeout)

- [waitFor(event: event | eventNS, filter?: WaitForFilter): CancelablePromise<any[]>](#emitterwaitforevent-filter)

- [waitFor(event: event | eventNS, options?: WaitForOptions): CancelablePromise<any[]>](#emitterwaitforevent-options)

- [listenTo(target: GeneralEventEmitter, event: event | eventNS, options?: ListenToOptions): this](#listentotargetemitter-events-string-options)

- [listenTo(target: GeneralEventEmitter, events: (event | eventNS)[], options?: ListenToOptions): this](#listentotargetemitter-events-string-options)

- [listenTo(target: GeneralEventEmitter, events: Object<event | eventNS, Function>, options?: ListenToOptions): this](#listentotargetemitter-events-string-options)

- [stopListening(target?: GeneralEventEmitter, event?: event | eventNS): Boolean](#stoplisteningtarget-object-event-string-boolean)

- [hasListeners(event?: event | eventNS): Boolean](#haslistenerseventstringboolean)

### static:

- [static once(emitter: EventEmitter2, event: string | symbol, options?: OnceOptions): CancelablePromise<any[]>](#eventemitter2onceemitter-name-options)

- [static defaultMaxListeners: number](#eventemitter2defaultmaxlisteners)

The `event` argument specified in the API declaration can be a string or symbol for a simple event emitter
and a string|symbol|Array(string|symbol) in a case of a wildcard emitter; 

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
emitter.emit(Symbol());
emitter.emit('foo');
emitter.emit('foo.bazz');
emitter.emit(['foo', 'bar']);
emitter.emit(['foo', Symbol()]);
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
emitter.emit(['foo', Symbol(), 'baz');
````

On the other hand, if the single-wildcard event name was passed to the on method, the callback would only observe the second of these events.


### emitter.addListener(event, listener, options?: object|boolean)
### emitter.on(event, listener, options?: object|boolean)

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

**Options:**

- `async:boolean= false`- invoke the listener in async mode using setImmediate (or setTimeout if not available)
or process.nextTick depending on the `nextTick` option.

- `nextTick:boolean= false`- use process.nextTick instead of setImmediate to invoke the listener asynchronously. 

- `promisify:boolean= false`- additionally wraps the listener to a Promise for later invocation using `emitAsync` method.
This option will be activated by default if its value is `undefined`
and the listener function is an `asynchronous function` (whose constructor name is `AsyncFunction`). 

if the options arguments is `true` it will be considered as `{promisify: true}`

if the options arguments is `false` it will be considered as `{async: true}`

```javascript
server.on('data', function(value) {
  console.log('The event was raised!');
}, {async: true});
```

### emitter.prependListener(event, listener, options?)

Adds a listener to the beginning of the listeners array for the specified event.

```javascript
server.prependListener('data', function(value1, value2, value3, ...) {
  console.log('The event was raised!');
});
```

**options:**

`options?`: See the [addListener options](#emitteronevent-listener-options)

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

#### emitter.once(event | eventNS, listener, options?)

Adds a **one time** listener for the event. The listener is invoked 
only the first time the event is fired, after which it is removed.

```javascript
server.once('get', function (value) {
  console.log('Ah, we have our first value!');
});
```

**options:**

`options?`: See the [addListener options](#emitteronevent-listener-options)

#### emitter.prependOnceListener(event | eventNS, listener, options?)

Adds a **one time** listener for the event. The listener is invoked 
only the first time the event is fired, after which it is removed.
The listener is added to the beginning of the listeners array

```javascript
server.prependOnceListener('get', function (value) {
  console.log('Ah, we have our first value!');
});
```

**options:**

`options?`: See the [addListener options](#emitteronevent-listener-options)

### emitter.many(event | eventNS, timesToListen, listener, options?)

Adds a listener that will execute **n times** for the event before being
removed. The listener is invoked only the first **n times** the event is 
fired, after which it is removed.

```javascript
server.many('get', 4, function (value) {
  console.log('This event will be listened to exactly four times.');
});
```

**options:**

`options?`: See the [addListener options](#emitteronevent-listener-options)

### emitter.prependMany(event | eventNS, timesToListen, listener, options?)

Adds a listener that will execute **n times** for the event before being
removed. The listener is invoked only the first **n times** the event is 
fired, after which it is removed.
The listener is added to the beginning of the listeners array.

```javascript
server.many('get', 4, function (value) {
  console.log('This event will be listened to exactly four times.');
});
```

**options:**

`options?`: See the [addListener options](#emitteronevent-listener-options)

### emitter.removeListener(event | eventNS, listener)
### emitter.off(event | eventNS, listener)

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


### emitter.removeAllListeners([event | eventNS])

Removes all listeners, or those of the specified event.


### emitter.setMaxListeners(n)

By default EventEmitters will print a warning if more than 10 listeners 
are added to it. This is a useful default which helps finding memory leaks. 
Obviously not all Emitters should be limited to 10. This function allows 
that to be increased. Set to zero for unlimited.


### emitter.getMaxListeners()

Returns the current max listener value for the EventEmitter which is either set by emitter.setMaxListeners(n) or defaults to EventEmitter2.defaultMaxListeners


### emitter.listeners(event | eventNS)

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

### emitter.emit(event | eventNS, [arg1], [arg2], [...])
Execute each of the listeners that may be listening for the specified event 
name in order with the list of arguments.

### emitter.emitAsync(event | eventNS, [arg1], [arg2], [...])

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

### emitter.waitFor(event | eventNS, [options])
### emitter.waitFor(event | eventNS, [timeout])
### emitter.waitFor(event | eventNS, [filter])

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
    },
    Promise: Promise, // Promise constructor to use,
    overload: false // overload cancellation api in a case of external Promise class
}).then(function(data){
    console.log(data); // ['foo', 'bar']
});

emitter.emit('event', 'foo', 'bar')
````

````javascript
var promise= emitter.waitFor('event');

promise.then(null, function(error){
    console.log(error); //Error: canceled
});

promise.cancel(); //stop listening the event and reject the promise
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

### EventEmitter2.once(emitter, event | eventNS, [options])
Creates a cancellable Promise that is fulfilled when the EventEmitter emits the given event or that is rejected
when the EventEmitter emits 'error'. 
The Promise will resolve with an array of all the arguments emitted to the given event.
This method is intentionally generic and works with the web platform EventTarget interface,
which has no special 'error' event semantics and does not listen to the 'error' event.

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

### listenTo(targetEmitter, events: event | eventNS, options?)

### listenTo(targetEmitter, events: (event | eventNS)[], options?)

### listenTo(targetEmitter, events: Object<event | eventNS, Function>, options?)

Listens to the events emitted by an external emitter and propagate them through itself.
The target object could be of any type that implements methods for subscribing and unsubscribing to its events. 
By default this method attempts to use `addListener`/`removeListener`, `on`/`off` and `addEventListener`/`removeEventListener` pairs,
but you able to define own hooks `on(event, handler)` and `off(event, handler)` in the options object to use
custom subscription API. In these hooks `this` refers to the target object.

The options object has the following interface:
- `on(event, handler): void`
- `off(event, handler): void`
- `reducer: (Function) | (Object<Function>): Boolean`

In case you selected the `newListener` and `removeListener` options when creating the emitter, 
the subscription to the events of the target object will be conditional, 
depending on whether there are listeners in the emitter that could listen them.

````javascript
var EventEmitter2 = require('EventEmitter2');
var http = require('http');

var server = http.createServer(function(request, response){
    console.log(request.url);
    response.end('Hello Node.js Server!')
}).listen(3000);

server.on('connection', function(req, socket, head){
   console.log('connect');
});

// activate the ability to attach listeners on demand 
var emitter= new EventEmitter2({
    newListener: true,
    removeListener: true
});

emitter.listenTo(server, {
    'connection': 'localConnection',
    'close': 'close'
}, {
    reducers: {
        connection: function(event){
            console.log('event name:' + event.name); //'localConnection'
            console.log('original event name:' + event.original); //'connection'
            return event.data[0].remoteAddress==='::1';
        }
    }
});

emitter.on('localConnection', function(socket){
   console.log('local connection', socket.remoteAddress);
});

setTimeout(function(){
    emitter.stopListening(server);
}, 30000);
````

### stopListening(target?: Object, event: event | eventNS): Boolean

Stops listening the targets. Returns true if some listener was removed.

### hasListeners(event | eventNS?:String):Boolean

Checks whether emitter has any listeners.

### emitter.listeners(event | eventNS)

Returns the array of listeners for the event named eventName.

### EventEmitter2.defaultMaxListeners

Sets default max listeners count globally for all instances, including those created before the change is made.
