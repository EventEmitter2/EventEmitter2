
exports.EventEmitter2 = (function(undefined) {

  var eventsList = { error: [] };
  var eventsTree = {};
  var newListeners = [];
  var maxListeners = 10;
  var anyListeners = [];
  var d = '.';
  var dd = d+d;
  var caseSensitive = false;

  function e() {};
  
  if (typeof Array.isArray !== "function"){
      Array.isArray = function(obj){ return Object.prototype.toString.call(obj) === "[object Array]" };
  }

  function _emitter(event, args) {
    var handler = eventsList[event];
    
    if(!handler) { return false; }
    
    if (typeof handler === 'function') {
      handler.apply(this, arguments);
    }
    else {
      for(var i=0, l = handler.length; i < l; i++) {
        handler[i].apply(e, arguments);
      }
    }
  }
  
  e.prototype.setMaxListeners = function(n) {
    maxListeners = n;
    return this;
  };

  e.prototype.emit = function emit(event) {

    if(~event.indexOf(d) || event === '*') {
      
      // tree traverse...
    }

    if (event === 'error') {
      if (eventsList.error.length === 0) {
        if (arguments[1] instanceof Error) {
          throw arguments[1];
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }
    
    _emitter.apply(this, arguments);
    return this;
  };

  function addListener(event, callback) {

    if(~event.indexOf(d)) {
      // tree traverse...
    }

    if(event === 'newListener') {
      for ( i = 0, l = newListeners.length; i < l; i++ ) {
        newListeners[i].apply(this, arguments);
      }
      newListeners.push(event);
      return this;
    }

    var handler = eventsList[event];

    if (!handler) {
      eventsList[event] = callback;
    }
    else if(Array.isArray(handler)) {
      
      eventsList[event].push(callback);
      
      if (handler.length === maxListeners && !handler.warned) {
        handler.warned = true;
        console.error('(node) warning: possible EventEmitter2 memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      handler.length);
        console.trace();
      }
    }
    else {
      eventsList[event] = [handler, callback];
    }
    
    return this;
  }
  
  e.prototype.addListener = e.prototype.on = addListener;
  
  e.prototype.onAny = function(fn) {
    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    anyListeners.push(fn);
    return this;
  };

  e.prototype.unAny = function(fn) {
    if (fn) {
      for(var i = 0, l = anyListeners.length; i < l; i++) {
        if(fn === anyListeners[i]) {
          anyListeners.splice(i, 1);
          return this;
        }
      }
    }
  };
  
  e.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  e.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    self.addListener(event, function() {
      if(ttl-- == 0) {
        self.removeListener(event, fn);
      } else {
        fn.apply(self, arguments);
      }
    });

    return self;
  };
  
  e.prototype.listeners = function(event) {
    return eventsList[event] || [];
  };
  
  e.prototype.listenersAny = function(event) {
    return anyListeners;
  };
  
  e.prototype.removeListener = function removeListener(event, listener) {
    // check for listener is stupid.
    if (eventsList[event]) {

      // Prune?

      if(!listener) {
        delete eventsList[event];
        return this;
      }

      if(typeof eventsList[event] === 'function') {
        delete eventsList[event];
        return this;
      }

      var listeners = eventsList[event];

      for(var i = 0, l = listeners.length; i < l; i++) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          return this;
        }
      }
    }
    return this;
  };

  e.prototype.removeAllListeners = e.prototype.removeListener;

  return e;
}());
