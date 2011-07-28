
;!function(environment, undefined) {

  var EventEmitter2 = environment.EventEmitter2 = function(conf) {
    this.init();
    this.setConf(conf);
  };

  EventEmitter2.prototype.init = function() {
    this._events = new Object;
    this.defaultMaxListeners = 10;
  };

  var isArray = Array.isArray;

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter2.prototype.setConf = function(conf) {
    this.wildcard = conf && conf.wildcard;
    this.delimiter = conf && conf.delimiter || '.';
    if(this.wildcard) {
      this.listenerTree = new Object;
    }
  };

  EventEmitter2.prototype.setMaxListeners = function(n) {
    this._events || this.init();
    this._events.maxListeners = n;
  };

  EventEmitter2.prototype.event = '';

  var searchListenerTree = function(handlers, type, tree, i) {
    if (!tree) {
      return
    }
    
    var listeners;
    
    if (i === type.length && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return tree;
      } else {
        for (var leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return tree;
      }
    }

    if (type[i] === '*' || tree[type[i]]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (type[i] === '*') {
        for (var branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = searchListenerTree(handlers, type, tree[branch], i+1);
          }
        }
        return listeners;
      }

      listeners = searchListenerTree(handlers, type, tree[type[i]], i+1);
    }


    if (tree['*']) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, tree['*'], i+1);
    }
    
    return listeners;
  };

  var growListenerTree = function(type, listener) {

    type = type.split(this.delimiter);

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = new Object;
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = this.defaultMaxListeners;

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  };

  EventEmitter2.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter2.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.un(event, listener);
      }
      fn.apply(null, arguments);
    };

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter2.prototype.emit = function() {
    this._events || this.init();
    
    var type = arguments[0];
    this.event = type;
    
    // If there is no 'error' event listener then throw.

    if (type === 'newListener') {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_allListenerFn* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this._all[i].apply(this, args);
      }
    }

    if (type === 'error') {
      if (this._events.error && typeof this._events.error !== 'function') {
        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = type.split(this.delimiter);
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type]; 
    }

    if (typeof handler === 'function') {
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
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

  EventEmitter2.prototype.on = function(type, listener) {
    this._events || this.init();

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
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

  EventEmitter2.prototype.onAny = function(fn) {

    if(!this._all) {
      this._all = [];
    }

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
  };

  EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;

  EventEmitter2.prototype.un = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers;

    if(this.wildcard) {
      var ns = type.split(this.delimiter);
      var leaf = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
      
      if('undefined' === typeof leaf) { return this; }
      handlers = leaf._listeners;
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
    }

    if (isArray(handlers)) {

      var position = -1;

      for (var i = 0, length = handlers.length; i < length; i++) {
        if (handlers[i] === listener ||
          (handlers[i].listener && handlers[i].listener === listener) ||
          (handlers[i]._origin && handlers[i]._origin === listener)) {
          position = i;
          break;
        }
      }

      if (position < 0) { 
        return this; 
      }

      if(this.wildcard) {
        leaf._listeners.splice(position, 1)
      }
      else {
        this._events[type].splice(position, 1);
      }

      if (handlers.length === 0) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    } 
    else if (handlers === listener ||
      (handlers.listener && handlers.listener === listener) ||
      (handlers._origin && handlers._origin === listener)) {
      if(this.wildcard) {
        delete leaf._listeners;
      }
      else {
        delete this._events[type];
      }
    }

    return this;
  };

  EventEmitter2.prototype.unAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter2.prototype.removeListener = EventEmitter2.prototype.un;

  EventEmitter2.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      this._events || this.init();
      return this;
    }

    if(this.wildcard) {
      var ns = type.split(this.delimiter);
      var leaf = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      if('undefined' === typeof leaf) { return this; }
      leaf._listeners = null;
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter2.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = type.split(this.delimiter);
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || this.init();

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

}(typeof exports === 'undefined' ? window : exports);
