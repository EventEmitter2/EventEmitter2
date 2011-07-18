
var EventEmitter2 = exports.EventEmitter2 = function(conf) {
  this._events = new Object();
  this.wildcards = false;
  this.defaultMaxListeners = 10;
};
var isArray = Array.isArray;

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.

EventEmitter2.prototype.setMaxListeners = function(n) {
  this._events.maxListeners = n;
};

EventEmitter2.prototype.delimiter = '.';

EventEmitter2.prototype.verbose = false;

EventEmitter2.prototype._wildcard = function(handlers, type, tree, i) {
  for(var branch in tree) {
    if(tree.hasOwnProperty(branch)) {
      this._searchListenerTree(handlers, type, tree[branch], i);
    }
  }
}

EventEmitter2.prototype._searchListenerTree = function(handlers, type, tree, i) {

  if(i === type.length) { 
    if(typeof tree === 'function') {
      handlers.push(tree);
    }
    else {
      handlers = handlers.concat(tree);
    }
  }

  if(type[i]) {
    if(type[i] === '*') {
      this._wildcard(handlers, type, tree, i+1);
    }
    else {
      this._searchListenerTree(handlers, type, tree[type[i]], i+1);
    }
  }
};

EventEmitter2.prototype._growListenerTree = function(type, listeners) {

  var d = this.delimiter;

  if (type.charAt(0) === d) {
    type = type.slice(1);
  }
  
  if(type.charAt(type.length-1) === d) {
    type = type.slice(x.length-1, x.length);
  }

  type = type.split(this.delimiter);

  var tree = this.listenerTree;
  var name = true;

  while (name) {
    name = type.shift();
    if (type.length === 1) {
      return tree[name] = listeners;
    }

    if (!tree[name]) {
      tree[name] = {};
    }

    tree = tree[name];
  }
  
  return true;

};

EventEmitter2.prototype.emit = function() {

  var type = arguments[0];
  // If there is no 'error' event listener then throw.

  if (type === 'newListener') {
    if(!this._events.newListener) { return false; }
  }

  else if (type === 'error') {
    if (this._events.error && 'function' !== typeof this._events.error) {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  var handler = this._events[type];

  if(this.wildcards) {
    for (var i = type.length - 1; i >= 0; i--) { // performance indexOf
      if(type[i] === '*') {
        handler = this.searchListenerTree([]);
        break;
      }
    }    
  }

  if ('function' === typeof handler) {

    if(arguments.length === 1) {
      handler.call(this);
    }
    else if(arguments.length > 1)
      switch (arguments.length) {
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          var l = arguments.length;
          var args = new Array(l - 1);
          for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
          handler.apply(this, args);
      }
    return true;

  } 
  else if (handler) {
    
    var l = arguments.length;
    var args = new Array(l - 1);
    for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter2.prototype.on = function(type, listener) {

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if(this.wildcards) {
    for (var i = type.length - 1; i >= 0; i--) { // performance indexOf
      if(type[i] === this.delimiter) {
        handler = this._searchListenerTree();
        break;
      }
    }    
  }

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  }
  else if('function' !== typeof this._events[type]) {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }
  else if (isArray(this._events[type])) {
    // If we've already got an array, just append.
    this._events[type].push(listener);

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = this.defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;

EventEmitter2.prototype.once = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('.once only takes instances of Function');
  }

  var self = this;
  function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  };

  g.listener = listener;
  self.on(type, g);

  return this;
};

EventEmitter2.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var position = -1;
    for (var i = 0, length = list.length; i < length; i++) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener))
      {
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    list.splice(position, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (list === listener ||
             (list.listener && list.listener === listener))
  {
    delete this._events[type];
  }

  return this;
};

EventEmitter2.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter2.prototype.listeners = function(type) {
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};
