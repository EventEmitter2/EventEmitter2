;!function(environment, undefined) {

  var eventsList = { error: [] };
  var eventsTree = {};

  var newListeners = [];
  var maxListeners = 10;
  var anyListeners = [];
  var flatwildListeners = [];

  var d = '.';
  var dd = d+d;
  var caseSensitive = false;

  var emitTrees = [];
  var emitNames = [];

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
    var self = this;
    var args = arguments;

    // error emit, handle as such
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

   if (~event.indexOf('*')) { 
      // if we have a wildcard
      if (event === '*') {
        // emit on all local space
        for (e in eventTree) {
          // I would prefer to use Object.keys, but ECMA-5
          if ( eventsList.hasOwnProperty(e) ) {
            for (i = 0, l = eventsList[e].length; i < l; i++) {
              eventsList[e][i].apply(self, args);
            }
          }
        }
        // emit all flat wild
        for (i = 0, l = flatwildListeners.length; i < l; i++) {
          flatwildListeners[i].apply(self,args);
        }
      }
      else {
        if (!~event.indexOf('*' + d) && !~event.indexOf(d + '*')) { //doesn't have *.
          // none-flat, with a wildcard not attached to a delim
          throw new Error('emitting on a bad wildcard');
        }
        //TODO Charlie's Emit
      }
    }
    else if (~event.indexOf(d)){
      // check namespace error
      if (event.charAt(0) === d || event.charAt(event.length-1) === d || ~event.indexOf(dd)) {
        // bad delimiter
        throw new Error('emitting on bad namespace');
      }

      // re-implementation of indexzero's emitter
      var names = event, name = '';
      var a = 0, b = names.indexOf(d);
      name = names.substring(a,b);
      names = names.substring(b+1); //+1 for the delimiter
      // the queue is emitBuffer;
      emitTrees.push(eventsTree); //add the current level
      //emitNames; //add the first name
      var queued = 0; //number of items added to queue
      var toQueue = 0;

      // to prevent sub-string later
      name = names.substring(a,b);
      names = names.substring(b+1); //+1 for the delimiter
      if (eventsTree['*']) {
        emitTree.push(eventsTree['*']);
        emitNames.push('*');
        queued++;
      }
      if (eventsTree[name]) {
        emitTree.push(eventsTree[name]);
        emitNames.push(name);
        queued++;
      }

      // traverse the namespace
      while(~b) {
        name = names.substring(a,b);
        names = names.substring(b+1); //+1 for the delimiter

        // by checking out namespace level (depth first)
        while (queued) {
          var pop = emitTrees.shift();
          levelName = emitNames.shift();
          queued--;
          if (pop['*']) {
            emitTrees.push(pop['*']);
            emitNames.push(levelName + d + '*');
            // above can be sped up by pre-creating d + '*'
            toQueue++;
          }
          if (pop[name]) {
            emitTrees.push(pop[name]);
            emitNames.push(levelName + d + name);
            toQueue++;
          }
        }

        // refresh the queues
        queued = toQueue;
        toQueue = 0;

        // now to check if we are at the end
        b = handler.indexOf(d);
        if (~b) {
          // emit everything after appending name or *
          while (queued) {
            pop = emitTrees.shift();
            levelName = emitNames.shift();
            queued--;
            if (pop['*']) {
              fn = eventsList[levelName + d + '*'];
              if ( typeof fn === 'function' ) {
                fn.apply(this,arguments);
              }
              else {
                for ( i = 0, l = fn.length; i < l; i++) {
                  fn[i].apply(this,arguments);
                }
              }
            }
            // end of ['*']
            if (pop[name]) {
              fn = eventsList[levelName + d + name];
              if ( typeof fn === 'function' ) {
                fn.apply(this,arguments);
              }
              else {
                for ( i = 0, l = fn.length; i < l; i++) {
                  fn[i].apply(this,arguments);
                }
              }
            }
            // end [name]
          }
          // end of ~b
        }
        // if there are more delimiters, then we loop further
        // we do all the stuff up top, so nothing to do here
      }
      //w
    } 
    else {
      // this is a none-namespaced, non-wildcard
      _emitter.apply(this, arguments);

      return this;
    }

    // shouldn't get here..?
    console.log('at the end of emit');
    return this;
  };

  function addListener(event, callback) {

    // check for * errors
    if (~event.indexOf('*')) {
      if (event !== '*') {
        var _t = event.split(d);
        for (i = 0, l = _t.length; i < l; i++) {
          if (~_t[i].indexOf('*') && _t[i] !== '*') {
            throw new Error ('bad wildcard location in event to addListener');
          }
        }
      }
    }

    if (~event.indexOf(d)) {
      // check for errors
      if (event.charAt(0) === d || 
          event.charAt(event.length-1) === d ||
          ~event.indexOf(dd)) {
        // bad delimiter
        throw new Error('emitting on bad namespace');
      } 

      // traverse and set
      var name = '';
      var a = 0, b = 1;
      var handle = event;
      var tree = eventsTree;
      while (~b) {
        b = handle.indexOf(d);
        name = handle.substr(a,b);
        handle = handle.substr(b+1);

        // check for bad * errors

        // try to delay allocating {}
        if (!tree[name]) { 
          tree = tree[name] = true;
        }
        else if (tree[name] === true) {
          tree = tree[name] = {};
        }
        else {
          tree = tree[name];
        }
      }
    }

    // emit newListener here
    // to prevent looping
      for ( i = 0, l = newListeners.length; i < l; i++ ) {
        newListeners[i].apply(this, arguments);
      }

      for ( i = 0, l = flatwildListeners.length; i < l; i++ ) {
        flatwildListeners[i].apply(this, arguments);
      }

      for ( i = 0, l = anyListeners.length; i < l; i++ ) {
        anyListeners[i].apply(this, arguments);
      }

    ////

    if (event === 'newListener') {
      newListeners.push(event);
      return this;
    }

    ////

    if (event === '*') {
      flatwildListeners.push(callback);
      return this;
    }

    ////

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

  environment.EventEmitter2 = e;

}(typeof exports === 'undefined' ? window : exports);
