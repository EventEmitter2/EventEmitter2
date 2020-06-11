/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */


var defaultMaxListeners = 10;
var nextTickSupported = typeof process == 'object' && typeof process.nextTick == 'function';
var symbolsSupported = typeof Symbol === 'function';
var reflectSupported = typeof Reflect === 'object';
var setImmediateSupported = typeof setImmediate === 'function';
var _setImmediate = setImmediateSupported ? setImmediate : setTimeout;
var ownKeys = symbolsSupported ? (reflectSupported && typeof Reflect.ownKeys === 'function' ? Reflect.ownKeys : function (obj) {
  var arr = Object.getOwnPropertyNames(obj);
  arr.push.apply(arr, Object.getOwnPropertySymbols(obj));
  return arr;
}) : Object.keys;


function logPossibleMemoryLeak(count, eventName) {
  var errorMsg = '(node) warning: possible EventEmitter memory ' +
    'leak detected. ' + count + ' listeners added. ' +
    'Use emitter.setMaxListeners() to increase limit.';

  if (this.verboseMemoryLeak) {
    errorMsg += ' Event name: ' + eventName + '.';
  }

  if (typeof process !== 'undefined' && process.emitWarning) {
    var e = new Error(errorMsg);
    e.name = 'MaxListenersExceededWarning';
    e.emitter = this;
    e.count = count;
    process.emitWarning(e);
  } else {
    console.error(errorMsg);

    if (console.trace) {
      console.trace();
    }
  }
}


function insertElement(array, element, prepend = false) {
  if (prepend) {
    array.unshift(element);
  } else {
    array.push(element);
  }
}

function toObject(keys, values) {
  var obj = {};
  var key;
  var len = keys.length;
  var valuesCount = values ? value.length : 0;
  for (var i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = i < valuesCount ? values[i] : undefined;
  }
  return obj;
}

class TargetObserver {

  constructor(emitter, target, options) {
    this._emitter = emitter;
    this._target = target;
    this._listeners = {};
    this._listenersCount = 0;
  
    var on, off;
  
    if (options.on || options.off) {
      on = options.on;
      off = options.off;
    }
  
    if (target.addEventListener) {
      on = target.addEventListener;
      off = target.removeEventListener;
    } else if (target.addListener) {
      on = target.addListener;
      off = target.removeListener;
    } else if (target.on) {
      on = target.on;
      off = target.off;
    }
  
    if (!on && !off) throw Error('target does not implement any known event API')
    if (typeof on !== 'function') throw TypeError('on method must be a function')
    if (typeof off !== 'function') throw TypeError('off method must be a function')
  
    this._on = on;
    this._off = off;
  
    if (!emitter._observers) emitter._observers = []
    emitter._observers.push(this)
  }

  subscribe(event, localEvent, reducer) {
    var observer = this;
    var target = this._target;
    var emitter = this._emitter;
    var listeners = this._listeners;

    function handler(...data) {
      const eventObj = { data, name: localEvent, original: event }
      if (reducer && reducer.call(target, eventObj) === false) return
      emitter.emit(localEvent, ...data)
    }


    if (listeners[event]) throw Error('Event \'' + event + '\' is already listening');


    this._listenersCount++;

    if (emitter._newListener && emitter._removeListener && !observer._onNewListener) {

      this._onNewListener = function (_event) {
        if (_event === localEvent && listeners[event] === null) {
          listeners[event] = handler;
          observer._on.call(target, event, handler);
        }
      };

      emitter.on('newListener', this._onNewListener);

      this._onRemoveListener = function (_event) {
        if (_event === localEvent && !emitter.hasListeners(_event) && listeners[event]) {
          listeners[event] = null;
          observer._off.call(target, event, handler);
        }
      };

      listeners[event] = null;

      emitter.on('removeListener', this._onRemoveListener);
    } else {
      listeners[event] = handler;
      observer._on.call(target, event, handler);
    }
  }

  unsubscribe (event) {
    var observer = this;
    var listeners = this._listeners;
    var emitter = this._emitter;
    var handler;
    var events;
    var off = this._off;
    var target = this._target;
    var i;

    if (event && typeof event !== 'string') {
      throw TypeError('event must be a string');
    }

    function clearRefs() {
      if (observer._onNewListener) {
        emitter.off('newListener', observer._onNewListener);
        emitter.off('removeListener', observer._onRemoveListener);
        observer._onNewListener = null;
        observer._onRemoveListener = null;
      }
      var index = findTargetIndex.call(emitter, observer);
      emitter._observers.splice(index, 1);
    }

    if (event) {
      handler = listeners[event];
      if (!handler) return;
      off.call(target, event, handler);
      delete listeners[event];
      if (!--this._listenersCount) {
        clearRefs();
      }
    } else {
      events = ownKeys(listeners);
      i = events.length;
      while (i-- > 0) {
        event = events[i];
        off.call(target, event, listeners[event]);
      }
      this._listeners = {};
      this._listenersCount = 0;
      clearRefs();
    }
  }

}


function resolveOptions(options, schema, reducers) {
  var computedOptions = Object.assign({}, schema);
  if (!options) return computedOptions;
  if (typeof options !== 'object') throw TypeError('options must be an object') 

  for (let option in options) {
    if (!option in schema) throw Error('Unknown "' + option + '" option');
    const value = options[option], reducer = reducers[option];

    if (!value) continue
    if (!reducer) {
      computedOptions[option] = value
    } else {
      computedOptions[option] = reducer(value, function reject(reason) {
        throw Error('Invalid "' + option + '" option value' + (reason ? '. Reason: ' + reason : ''))
      })
    }
  }
  return computedOptions;
}

function constructorReducer(value, reject) {
  if (typeof value !== 'function' || !value.hasOwnProperty('prototype')) {
    reject('value must be a constructor');
  }
  return value;
}

function makeTypeReducer(types) {
  var message = 'value must be type of ' + types.join('|');
  var len = types.length;
  var firstType = types[0];
  var secondType = types[1];

  if (len === 1) {
    return function (v, reject) {
      if (typeof v === firstType) {
        return v;
      }
      reject(message);
    }
  }

  if (len === 2) {
    return function (v, reject) {
      var kind = typeof v;
      if (kind === firstType || kind === secondType) return v;
      reject(message);
    }
  }

  return function (v, reject) {
    var kind = typeof v;
    var i = len;
    while (i-- > 0) {
      if (kind === types[i]) return v;
    }
    reject(message);
  }
}

var functionReducer = makeTypeReducer(['function']);

var objectFunctionReducer = makeTypeReducer(['object', 'function']);

function makeCancelablePromise(Promise, executor, options) {
  var isCancelable;
  var callbacks;
  var timer = 0;
  var subscriptionClosed;

  var promise = new Promise(function (resolve, reject, onCancel) {
    options = resolveOptions(options, {
      timeout: 0,
      overload: false
    }, {
      timeout: function (value, reject) {
        value *= 1;
        if (typeof value !== 'number' || value < 0 || !Number.isFinite(value)) {
          reject('timeout must be a positive number');
        }
        return value;
      }
    });

    isCancelable = !options.overload && typeof Promise.prototype.cancel === 'function' && typeof onCancel === 'function';

    function cleanup() {
      if (callbacks) {
        callbacks = null;
      }
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    }

    var _resolve = function (value) {
      cleanup();
      resolve(value);
    };

    var _reject = function (err) {
      cleanup();
      reject(err);
    };

    if (isCancelable) {
      executor(_resolve, _reject, onCancel);
    } else {
      callbacks = [function (reason) {
        _reject(reason || Error('canceled'));
      }];
      executor(_resolve, _reject, function (cb) {
        if (subscriptionClosed) {
          throw Error('Unable to subscribe on cancel event asynchronously')
        }
        if (typeof cb !== 'function') {
          throw TypeError('onCancel callback must be a function');
        }
        callbacks.push(cb);
      });
      subscriptionClosed = true;
    }

    if (options.timeout > 0) {
      timer = setTimeout(function () {
        var reason = Error('timeout');
        timer = 0;
        promise.cancel(reason);
        reject(reason);
      }, options.timeout);
    }
  });

  if (!isCancelable) {
    promise.cancel = function (reason) {
      if (!callbacks) {
        return;
      }
      var length = callbacks.length;
      for (var i = 1; i < length; i++) {
        callbacks[i](reason);
      }
      // internal callback to reject the promise
      callbacks[0](reason);
      callbacks = null;
    };
  }

  return promise;
}

function findTargetIndex(observer) {
  var observers = this._observers;
  if (!observers) {
    return -1;
  }
  var len = observers.length;
  for (var i = 0; i < len; i++) {
    if (observers[i]._target === observer) return i;
  }
  return -1;
}

// Attention, function return type now is array, always !
// It has zero elements if no any matches found and one or more
// elements (leafs) if there are matches
//
function searchListenerTree(handlers, type, tree, i, typeLength) {
  if (!tree) return null;

  if (i === 0) {
    var kind = typeof type;
    if (kind === 'string') {
      var ns, n, l = 0, j = 0, delimiter = this.delimiter, dl = delimiter.length;
      if ((n = type.indexOf(delimiter)) !== -1) {
        ns = new Array(5);
        do {
          ns[l++] = type.slice(j, n);
          j = n + dl;
        } while ((n = type.indexOf(delimiter, j)) !== -1);

        ns[l++] = type.slice(j);
        type = ns;
        typeLength = l;
      } else {
        type = [type];
        typeLength = 1;
      }
    } else if (kind === 'object') {
      typeLength = type.length;
    } else {
      type = [type];
      typeLength = 1;
    }
  }

  var listeners = null, branch, xTree, xxTree, isolatedBranch, endReached, currentType = type[i],
    nextType = type[i + 1], branches, _listeners;

  if (i === typeLength && tree._listeners) {
    //
    // If at the end of the event(s) list and the tree has listeners
    // invoke those listeners.
    //
    if (typeof tree._listeners === 'function') {
      handlers && handlers.push(tree._listeners);
      return [tree];
    } else {
      handlers && handlers.push.apply(handlers, tree._listeners);
      return [tree];
    }
  }

  if (currentType === '*') {
    //
    // If the event emitted is '*' at this part
    // or there is a concrete match at this patch
    //
    branches = ownKeys(tree);
    n = branches.length;
    while (n-- > 0) {
      branch = branches[n];
      if (branch !== '_listeners') {
        _listeners = searchListenerTree(handlers, type, tree[branch], i + 1, typeLength);
        if (_listeners) {
          if (listeners) {
            listeners.push.apply(listeners, _listeners);
          } else {
            listeners = _listeners;
          }
        }
      }
    }
    return listeners;
  } else if (currentType === '**') {
    endReached = (i + 1 === typeLength || (i + 2 === typeLength && nextType === '*'));
    if (endReached && tree._listeners) {
      // The next element has a _listeners, add it to the handlers.
      listeners = searchListenerTree(handlers, type, tree, typeLength, typeLength);
    }

    branches = ownKeys(tree);
    n = branches.length;
    while (n-- > 0) {
      branch = branches[n];
      if (branch !== '_listeners') {
        if (branch === '*' || branch === '**') {
          if (tree[branch]._listeners && !endReached) {
            _listeners = searchListenerTree(handlers, type, tree[branch], typeLength, typeLength);
            if (_listeners) {
              if (listeners) {
                listeners.push.apply(listeners, _listeners);
              } else {
                listeners = _listeners;
              }
            }
          }
          _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
        } else if (branch === nextType) {
          _listeners = searchListenerTree(handlers, type, tree[branch], i + 2, typeLength);
        } else {
          // No match on this one, shift into the tree but not in the type array.
          _listeners = searchListenerTree(handlers, type, tree[branch], i, typeLength);
        }
        if (_listeners) {
          if (listeners) {
            listeners.push.apply(listeners, _listeners);
          } else {
            listeners = _listeners;
          }
        }
      }
    }
    return listeners;
  } else if (tree[currentType]) {
    listeners = searchListenerTree(handlers, type, tree[currentType], i + 1, typeLength);
  }

  xTree = tree['*'];
  if (xTree) {
    //
    // If the listener tree will allow any match for this part,
    // then recursively explore all branches of the tree
    //
    searchListenerTree(handlers, type, xTree, i + 1, typeLength);
  }

  xxTree = tree['**'];
  if (xxTree) {
    if (i < typeLength) {
      if (xxTree._listeners) {
        // If we have a listener on a '**', it will catch all, so add its handler.
        searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
      }

      // Build arrays of matching next branches and others.
      branches = ownKeys(xxTree);
      n = branches.length;
      while (n-- > 0) {
        branch = branches[n];
        if (branch !== '_listeners') {
          if (branch === nextType) {
            // We know the next element will match, so jump twice.
            searchListenerTree(handlers, type, xxTree[branch], i + 2, typeLength);
          } else if (branch === currentType) {
            // Current node matches, move into the tree.
            searchListenerTree(handlers, type, xxTree[branch], i + 1, typeLength);
          } else {
            isolatedBranch = {};
            isolatedBranch[branch] = xxTree[branch];
            searchListenerTree(handlers, type, { '**': isolatedBranch }, i + 1, typeLength);
          }
        }
      }
    } else if (xxTree._listeners) {
      // We have reached the end and still on a '**'
      searchListenerTree(handlers, type, xxTree, typeLength, typeLength);
    } else if (xxTree['*'] && xxTree['*']._listeners) {
      searchListenerTree(handlers, type, xxTree['*'], typeLength, typeLength);
    }
  }

  return listeners;
}

function growListenerTree(type, listener) {
  var len = 0, j = 0, i, delimiter = this.delimiter, dl = delimiter.length, ns;

  if (typeof type === 'string') {
    if ((i = type.indexOf(delimiter)) !== -1) {
      ns = new Array(5);
      do {
        ns[len++] = type.slice(j, i);
        j = i + dl;
      } while ((i = type.indexOf(delimiter, j)) !== -1);

      ns[len++] = type.slice(j);
    } else {
      ns = [type];
      len = 1;
    }
  } else {
    ns = type;
    len = type.length;
  }

  //
  // Looks for two consecutive '**', if so, don't add the event at all.
  //
  if (len > 1) for (i = 0; i + 1 < len; i++) {
    if (ns[i] === '**' && ns[i + 1] === '**') return;
  }



  var tree = this.listenerTree, name;

  for (i = 0; i < len; i++) {
    name = ns[i];

    tree = tree[name] || (tree[name] = {});

    if (i === len - 1) {
      if (!tree._listeners) {
        tree._listeners = listener;
      } else {
        if (typeof tree._listeners === 'function') 
          tree._listeners = [tree._listeners];
        
        tree._listeners.push(listener);
        if (
          !tree._listeners.warned &&
          this._maxListeners > 0 &&
          tree._listeners.length > this._maxListeners
        ) {
          tree._listeners.warned = true;
          logPossibleMemoryLeak.call(this, tree._listeners.length, name);
        }
      }
      return true;
    }
  }

  return true;
}

function collectTreeEvents(tree, events, root, delimiter, asArray = false) {
  for (let branchName of ownKeys(tree).reverse()) {
    var path;

    if (branchName === '_listeners') {
      path = root;
    } else {
      path = root ? root.concat(branchName) : [branchName];
    }

    const isArrayPath = asArray || typeof branchName === 'symbol';
    const event = isArrayPath ? path : path.join(delimiter)
    if (tree['_listeners']) events.push(event)
    if (typeof tree[branchName] === 'object') 
      collectTreeEvents(tree[branchName], events, path, delimiter, isArrayPath);
  }

  return events;
}

function recursivelyGarbageCollect(root) {
  var flag;

  for (let key in root) if (root[key]) {
    flag = true;
    if (key !== '_listeners' && !recursivelyGarbageCollect(root[key])) {
      delete root[key];
    }
  }

  return flag;
}

class Listener {

  constructor(emitter, event, listener) {
    this.emitter = emitter;
    this.event = event;
    this.listener = listener;
  }

  off() {
    this.emitter.off(this.event, this.listener);
    return this;
  }
}


function setupListener(event, listener, options) {
  if (options === true) {
    promisify = true;
  } else if (options === false) {
    async = true;
  } else {
    if (!options || typeof options !== 'object') {
      throw TypeError('options should be an object or true');
    }
    var async = options.async;
    var promisify = options.promisify;
    var nextTick = options.nextTick;
    var objectify = options.objectify;
  }

  if (nextTick && !nextTickSupported)
    throw Error('process.nextTick is not supported');
  

  if (async || nextTick || promisify) {
    var _listener = listener;
    var _origin = listener._origin || listener;
    if (promisify === undefined) {
      promisify = listener.constructor.name === 'AsyncFunction';
    }

    listener = function (...args) {
      var context = this;
      var event = this.event;

      return promisify ? (nextTick ? Promise.resolve() : new Promise(function (resolve) {
        _setImmediate(resolve);
      }).then(function () {
        context.event = event;
        return _listener.apply(context, args)
      })) : (nextTick ? process.nextTick : _setImmediate)(function () {
        context.event = event;
        _listener.apply(context, args)
      });
    }

    listener._async = true;
    listener._origin = _origin;
  }

  return [listener, objectify ? new Listener(this, event, listener) : this];
}

class EventEmitter {

  constructor(conf = {}) {
    this._events = {};
    this._all = []
  
    this._conf = conf
    this.delimiter = conf.delimiter         || "."
  
    if (conf.maxListeners !== undefined) {
      this._maxListeners = conf.maxListeners
    } else {
      this._maxListeners = defaultMaxListeners
    }
  
    this.wildcard          = conf.wildcard          || false
    this._newListener      = conf.newListener       || false
    this._removeListener   = conf.removeListener    || false
    this.verboseMemoryLeak = conf.verboseMemoryLeak || false
    this.ignoreErrors      = conf.ignoreErrors
  
    if (this.wildcard) this.listenerTree = this._events
  }
  
}

EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property
EventEmitter.prototype.listenTo = listenTo
EventEmitter.prototype.stopListeningTo = stopListeningTo
EventEmitter.prototype.delimiter = '.';
EventEmitter.prototype.setMaxListeners = setMaxListeners;
EventEmitter.prototype.getMaxListeners = getMaxListeners;
EventEmitter.prototype.emitAsync = emitAsync;
EventEmitter.prototype.emit = emit
EventEmitter.prototype.eventNames = eventNames;
EventEmitter.prototype.listenersAny = listenersAny;
EventEmitter.prototype.waitFor = waitFor;
EventEmitter.prototype.listenerCount = listenerCount;
EventEmitter.prototype.hasListeners = hasListeners
EventEmitter.prototype.listeners = listeners;

EventEmitter.prototype.off = removeListener
EventEmitter.prototype.offAny = offAny;
EventEmitter.prototype.removeListener = removeListener;
EventEmitter.prototype.removeAllListeners = removeAllListeners

EventEmitter.prototype.event = '';

EventEmitter.prototype.once = function (event, fn, options) {
  return _many(this, event, 1, fn, false, options)
}

EventEmitter.prototype.prependOnceListener = function (event, fn, options) {
  return _many(this, event, 1, fn, true, options)
}

EventEmitter.prototype.many = function (event, ttl, fn, options) {
  return _many(this, event, ttl, fn, false, options)
}

EventEmitter.prototype.prependMany = function (event, ttl, fn, options) {
  return _many(this, event, ttl, fn, true, options)
}

EventEmitter.prototype.on = function (type, listener, options) {
  if (typeof type === 'function') {
    return _onAny(this, type, listener);
  } else {
    return _on(this, type, listener, false, options);
  }
}

EventEmitter.prototype.prependListener = function (type, listener, options) {
  return _on(this, type, listener, true, options);
}

EventEmitter.prototype.onAny = function (fn) {
  return _onAny(this, fn, false)
}

EventEmitter.prototype.prependAny = function (fn) {
  return _onAny(this, fn, true)
}

EventEmitter.prototype.addListener = EventEmitter.prototype.on


function listenTo(target, events, options) {

  options = resolveOptions(options, {
    on: undefined,
    off: undefined,
    reducers: undefined
  }, {
    on: functionReducer,
    off: functionReducer,
    reducers: objectFunctionReducer
  })

  return _listenTo(this, target, events, options);
}


function _listenTo(emitter, target, events, options) {
  if (typeof target !== 'object') throw TypeError('target musts be an object')

  function listen(events) {
    if (typeof events !== 'object') throw TypeError('events must be an object');
    var reducers = options.reducers;
    var index = findTargetIndex.call(emitter, target);
    var observer;

    if (index === -1) {
      observer = new TargetObserver(emitter, target, options);
    } else {
      observer = emitter._observers[index];
    }

    var keys = ownKeys(events);
    var len = keys.length;
    var event;
    var isSingleReducer = typeof reducers === 'function';

    for (var i = 0; i < len; i++) {
      event = keys[i];
      observer.subscribe(
        event,
        events[event] || event,
        isSingleReducer ? reducers : reducers && reducers[event]
      );
    }
  }

  Array.isArray(events) ?
    listen(toObject(events)) :
    (typeof events === 'string' ? listen(toObject(events.split(/\s+/))) : listen(events));

  return emitter;
}


function stopListeningTo(target, event) {
  if (!this._observers) return false;
  if (target && typeof target !== 'object')
    throw TypeError('target should be an object')

  var matched = false;

  for (let i = this._observers.length - 1; i >= 0; i--) {
    const observer = this._observers[i]
    if (target && observer._target !== target) continue;
    observer.unsubscribe(event);
    matched = true;
  }

  return matched;
};

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.



function setMaxListeners(n) {
  if (n !== undefined) {
    this._maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  }
}

function getMaxListeners() {
  return this._maxListeners;
}



function _many(self, event, ttl, fn, prepend, options) {
  if (typeof fn !== 'function') throw new Error('many only accepts instances of Function');
  listener._origin = fn
  return _on(self, event, listener, prepend, options)

  function listener() {
    if (--ttl === 0) self.off(event, listener)
    return fn.apply(self, arguments)
  }
}


function emit(...args) {
  var type = args.shift()

  if (type === 'newListener' && !this._newListener) {
    if (!this._events.newListener) return false;
  }

  const handlerAll = this._all.slice();
  const handler = [];

  if (this.wildcard) {
    const ns = type;
    let containsSymbol = false;

    if (typeof type === 'object') {
      if (symbolsSupported) for (let i = 0; i < type.length; i++)
        if (typeof type[i] === 'symbol') {
          containsSymbol = true;
          break;
        }
      if (!containsSymbol) type = type.join(this.delimiter);
    }
    searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
  } else {
    const d = this._events[type]
    if (typeof d === 'function') {
      handler.push(d)
    } else if (Array.isArray(d)) {
      handler.push(...d)
    }
  }

  let fn;

  if (handler.length + handlerAll.length) switch (args.length) {
    case 0 : 
      while (fn = handlerAll.shift()) { this.event = type; fn.call(this, type) }
      while (fn = handler   .shift()) { this.event = type; fn.call(this) }
      return true;
    case 1 : 
      while (fn = handlerAll.shift()) { this.event = type; fn.call(this, type, args[0]) }
      while (fn = handler   .shift()) { this.event = type; fn.call(this, args[0]) }
      return true;
    case 2 : 
      while (fn = handlerAll.shift()) { this.event = type; fn.call(this, type, args[0], args[1]) }
      while (fn = handler   .shift()) { this.event = type; fn.call(this, args[0], args[1]) }
      return true;
    default: 
      while (fn = handlerAll.shift()) { this.event = type; fn.call(this, type, ...args) }
      while (fn = handler   .shift()) { this.event = type; fn.call(this, ...args) }
      return true;
  }
  
  if (type !== 'error' || this.ignoreErrors) return false
  if (args[0] instanceof Error) throw args[0];
  throw new Error("Uncaught, unspecified 'error' event.");
}







function emitAsync() {
  var type = arguments[0], ns, containsSymbol;
  var args, l, i, j;

  if (type === 'newListener' && !this._newListener) {
    if (!this._events.newListener) { return Promise.resolve([false]); }
  }

  if (this.wildcard) {
    ns = type;
    if (type !== 'newListener' && type !== 'removeListener') {
      if (typeof type === 'object') {
        l = type.length;
        if (symbolsSupported) {
          for (i = 0; i < l; i++) {
            if (typeof type[i] === 'symbol') {
              containsSymbol = true;
              break;
            }
          }
        }
        if (!containsSymbol) {
          type = type.join(this.delimiter);
        }
      }
    }
  }

  var promises = [];


  var handler;

  if (this._all) {
    for (i = 0, l = this._all.length; i < l; i++) {
      this.event = type;
      switch (arguments.length) {
        case 1: promises.push(this._all[i].call(this, type)); break;
        case 2: promises.push(this._all[i].call(this, type, arguments[1])); break;
        case 3: promises.push(this._all[i].call(this, type, arguments[1], arguments[2])); break;
        default: promises.push(this._all[i].apply(this, arguments));
      }
    }
  }

  if (this.wildcard) {
    handler = [];
    searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
  } else {
    handler = this._events[type];
  }

  const al = arguments.length;

  if (typeof handler === 'function') {
    this.event = type;
    switch (arguments.length) {
      case 1: promises.push(handler.call(this)); break;
      case 2: promises.push(handler.call(this, arguments[1])); break;
      case 3: promises.push(handler.call(this, arguments[1], arguments[2])); break;
      default:
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
        promises.push(handler.apply(this, args));
    }
  } else if (handler && handler.length) {
    handler = handler.slice();
    if (al > 3) {
      args = new Array(al - 1);
      for (j = 1; j < al; j++) args[j - 1] = arguments[j];
    }
    for (i = 0, l = handler.length; i < l; i++) {
      this.event = type;
      switch (arguments.length) {
        case 1: promises.push(handler[i].call(this)); break;
        case 2: promises.push(handler[i].call(this, arguments[1])); break;
        case 3: promises.push(handler[i].call(this, arguments[1], arguments[2])); break;
        default: promises.push(handler[i].apply(this, args));
      }
    }
  } else if (!this.ignoreErrors && !this._all && type === 'error') {
    if (arguments[1] instanceof Error) {
      return Promise.reject(arguments[1]); // Unhandled 'error' event
    } else {
      return Promise.reject("Uncaught, unspecified 'error' event.");
    }
  }

  return Promise.all(promises);
}

function _onAny(emitter, fn, prepend) {
  if (typeof fn !== 'function') throw new Error('onAny only accepts instances of Function');
  insertElement(emitter._all, fn, prepend)
  return emitter;
}



function _on(emitter, type, listener, prepend, options) {
  if (typeof listener !== 'function') throw new Error('on only accepts instances of Function');

  var returnValue = emitter;

  if (options !== undefined) {
    const temp = setupListener.call(emitter, type, listener, options);
    listener = temp[0];
    returnValue = temp[1];
  }

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  if (emitter._newListener) emitter.emit('newListener', type, listener)


  if (emitter.wildcard) {
    growListenerTree.call(emitter, type, listener);
    return emitter;
  }

  if (!emitter._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    emitter._events[type] = listener;
  } else {
    if (typeof emitter._events[type] === 'function') {
      // Change to array.
      emitter._events[type] = [emitter._events[type]];
    }

    // If we've already got an array, just add
    if (prepend) {
      emitter._events[type].unshift(listener);
    } else {
      emitter._events[type].push(listener);
    }

    // Check for listener leak
    if (
      !emitter._events[type].warned &&
      emitter._maxListeners > 0 &&
      emitter._events[type].length > emitter._maxListeners
    ) {
      emitter._events[type].warned = true;
      logPossibleMemoryLeak.call(emitter, emitter._events[type].length, type);
    }
  }

  return returnValue;
}





function removeListener(type, listener) {
  if (typeof listener !== 'function') throw new Error('removeListener only takes instances of Function');
  var leafs = [];

  if (this.wildcard) {
    var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
    leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    if (!leafs) return this;
  } else {
    // does not use listeners(), so no side effect of creating _events[type]
    if (!this._events[type]) return this;
    leafs.push({ _listeners: this._events[type] });
  }

  for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
    var leaf = leafs[iLeaf];
    const handlers = leaf._listeners;
    if (Array.isArray(handlers)) {

      var position = -1;

      for (var i = 0, length = handlers.length; i < length; i++) {
        if (handlers[i] === listener ||
          (handlers[i].listener && handlers[i].listener === listener) ||
          (handlers[i]._origin && handlers[i]._origin === listener)) {
          position = i;
          break;
        }
      }

      if (position < 0) continue;

      if (this.wildcard) {
        leaf._listeners.splice(position, 1);
        if (handlers.length === 0) delete leaf._listeners;
      } else {
        this._events[type].splice(position, 1);
        if (handlers.length === 0) delete this._events[type];
      }

      if (this._removeListener) this.emit("removeListener", type, listener);

      return this;
    } else if (handlers === listener ||
      (handlers.listener && handlers.listener === listener) ||
      (handlers._origin && handlers._origin === listener)) {
      if (this.wildcard) {
        delete leaf._listeners;
      } else {
        delete this._events[type];
      }
      if (this._removeListener) this.emit("removeListener", type, listener);
    }
  }

  this.listenerTree && recursivelyGarbageCollect(this.listenerTree);

  return this;
};




function offAny(fn) {
  if (fn === undefined) {
    while (this._all.length) {
      this.emit("removeListenerAny", this._all.shift())
    }
    return this;
  }

  const i = this._all.indexOf(fn)
  if (i === -1) return this;
  this._all.splice(i, 1);
  if (this._removeListener) {
    this.emit("removeListenerAny", fn);
  }
  return this;
};


function removeAllListeners(type) {
  if (type === undefined) {
    if (this.wildcard) {
      this.listenerTree = this._events = {};
    } else {
      this._events = {};
    }
    return this;
  }

  if (this.wildcard) {
    var leafs = searchListenerTree.call(this, null, type, this.listenerTree, 0), leaf, i;
    if (!leafs) return this;
    for (i = 0; i < leafs.length; i++) {
      leaf = leafs[i];
      leaf._listeners = null;
    }
    this.listenerTree && recursivelyGarbageCollect(this.listenerTree);
  } else {
    if (this._events) {
      this._events[type] = null;
    }
    return this;
  }
};


function listeners(type) {
  if (this.wildcard) {
    return listeners__wildcard.call(this, type)
  } else {
    return listeners__classic.call(this, type)
  }
}

function listeners__wildcard(type) {
  if (type === undefined) throw Error('event name required for wildcard emitter');
  var handlers = [];
  if (this.listenerTree) {
    var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
    searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
  }
  return handlers;
}

function listeners__classic(type) {
  if (!this._events) return [];

  if (type === undefined) {
    const allListeners = [];
    for (let key of ownKeys(this._events)) {
      const item = this._events[key];
      if (typeof item === 'function')
        allListeners.push(item);
      else
        allListeners.push(...item);
    }
    return allListeners;
  } else {
    var _events = this._events;
    if (!_events[type]) return []
    if (typeof _events[type] === 'function') {
      return [_events[type]]
    } else return _events[type]
  }
}




function eventNames(nsAsArray) {
  if (this.wildcard) {
    return collectTreeEvents(this.listenerTree, [], null, this.delimiter, nsAsArray)
  } else {
    if (!this._events) return []
    return ownKeys(this._events)
  }
}



function hasListeners(type) {
  if (this.wildcard) {
    var handlers = [];
    var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
    searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
    return handlers.length > 0;
  }

  var _events = this._events;
  var _all = this._all;

  return !!(_all && _all.length || _events && (type === undefined ? ownKeys(_events).length : _events[type]));
};


function listenersAny() {
  return this._all || [];
}

function listenerCount(type) {
  return this.listeners(type).length;
};

function waitFor(event, options) {
  var self = this;

  if (typeof options === 'number') options = { timeout: options }
  if (typeof options === 'function') options = { filter: options }


  options = resolveOptions(options, {
    timeout: 0,
    filter: undefined,
    handleError: false,
    Promise: Promise,
    overload: false
  }, {
    filter: functionReducer,
    Promise: constructorReducer
  });

  return makeCancelablePromise(options.Promise, function (resolve, reject, onCancel) {
    function listener(...args) {
      if (options.filter && !options.filter.apply(self, arguments)) return;
      var error = options.handleError ? args.shift() : null;
      if (error) return reject(error)
      resolve(args)
    }

    onCancel(function () {
      self.off(event, listener);
    });

    _on(self, event, listener, false);
  }, {
    timeout: options.timeout,
    overload: options.overload
  })
};

function once(emitter, name, options) {
  options = resolveOptions(options, { Promise, timeout: 0, overload: false }, {
    Promise: constructorReducer
  });


  return makeCancelablePromise(options.Promise, function (resolve, reject, onCancel) {
    if (typeof emitter.addEventListener === 'function') {
      function handler(...args) { resolve(args) };
      onCancel(function () {
        emitter.removeEventListener(name, handler)
      })
      emitter.addEventListener(name, handler, { once: true })
      return
    }

    function eventListener(...args) {
      if (name !== 'error') emitter.removeListener('error', errorListener)
      resolve(args);
    }
    function errorListener(err) {
      emitter.removeListener(name, eventListener);
      reject(err);
    }

    if (name !== 'error') emitter.once('error', errorListener)

    onCancel(function () {
      if (name !== 'error') emitter.removeListener('error', errorListener);
      emitter.removeListener(name, eventListener);
    });

    emitter.once(name, eventListener);
  }, {
    timeout: options.timeout,
    overload: options.overload
  });
}

Object.defineProperties(EventEmitter, {
  defaultMaxListeners: {
    get: function () {
      return EventEmitter.prototype._maxListeners;
    },
    set: function (n) {
      if (typeof n !== 'number' || n < 0 || Number.isNaN(n)) {
        throw TypeError('n must be a non-negative number')
      }
      EventEmitter.prototype._maxListeners = n;
    },
    enumerable: true
  },
  once: {
    value: once,
    writable: true,
    configurable: true
  }
});

Object.defineProperties(EventEmitter.prototype, {
  _maxListeners: {
    value: defaultMaxListeners,
    writable: true,
    configurable: true
  },
  _observers: { value: null, writable: true, configurable: true }
});

module.exports = EventEmitter
