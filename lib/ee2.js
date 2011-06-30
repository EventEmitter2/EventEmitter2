;!function(environment, undefined) {

  var eventsList = { error: [] };
  var eventsTree = {};

  var newListeners = [];
  var maxListeners = 10;
  var anyListeners = [];
  var flatwildListeners = [];

  var d = '.';
  var dd = d+d;
  var dlen = d.length;
  var dright = '*' + d;
  var dleft = d + '*';
  var caseSensitive = false;

  var emitTrees = [];
  var emitNames = []; // todo

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
      if (event === '*') { // if we have a wildcard
        for (e in eventTree) { // emit on all local space
          if (eventsList.hasOwnProperty(e)) { // only need to check eventsList for own properties
            if(typeof eventsList[e] === 'function') {
              eventsList[e][i].apply(self, args);
              break;
            }
            else {
              for (i = 0, l = eventsList[e].length; i < l; i++) {
                eventsList[e][i].apply(self, args);
                break;
              }
            }
          }
        }
        // emit all flat wild listners
        for (i = 0, l = flatwildListeners.length; i < l; i++) {
          flatwildListeners[i].apply(self,args);
        }
      }
      else {

        if (~event.indexOf(dright) && ~event.indexOf(dleft)) { // doesn't have *. or .*
          // none-flat, with a wildcard not attached to a delim
          throw new Error('emitting on a bad wildcard');
        }
        
        // guaranteed namespaced wildcarded event
        var names = event, name = '';
        var a = 0, b = names.indexOf(d);
        var queued = 0, toQueue = 0;

        name = names.substr(a, b);
        names = names.substr(b+dlen);

        if(name === '*') {
          // emitting a wild card, we can add all names from the current namespace.
          for (e in eventTree) {
            if (eventTree.hasOwnProperty(e)) {
              emitTrees.push(eventsTree[e]);
              emitNames.push(e);
              queued++;
            }
          }
        }
        else {
          if (eventsTree['*']) {
            emitTrees.push(eventsTree['*']);
            emitNames.push('*');
            queued++;
          }

          if (eventsTree[name]) {
            emitTrees.push(eventsTree[name]);
            emitNames.push(name);
            queued++;
          }          
        }


        // traverse the namespace
        while(~b) {

          name = names.substr(a,b);
          names = names.substr(b+dlen);

          // by checking out namespace level (depth first)
          while (queued) {
            
            var pop = emitTrees.shift();
            levelName = emitNames.shift();
            
            queued--;
            
            if(name === '*') {
              // emitting a wild card, we can add all names from the current namespace.
              for (e in pop) {
                if (pop.hasOwnProperty(e)) {
                  emitTrees.push(pop[e]);
                  emitNames.push(e);
                  toQueue++;
                }
              }
            }
            else {
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
          }

          // refresh the queues
          queued = toQueue;
          toQueue = 0;

          // now to check if we are at the end
          b = names.indexOf(d);

          if (~~b) {
            // emit everything after appending name or *
            while (queued) {
              pop = emitTrees.shift();
              levelName = emitNames.shift();
              queued--;
              if (eventsList[levelName]) {
                fn = eventsList[levelName];
                if ( typeof fn === 'function' ) {
                  fn.apply(this, arguments);
                }
                else {
                  for (i = 0, l = fn.length; i < l; i++) {
                    fn[i].apply(this, arguments);
                  }
                }
              }
              // end [name]
            }
            // end of queued
          }
          // end of ~~b
          // if there are more delimiters, then we loop further
          // we do all the stuff up top, so nothing to do here
        }
      }
    }
    else if (~event.indexOf(d)) {
      // check namespace error
      if (event.charAt(0) === d || event.charAt(event.length-1) === d || ~event.indexOf(dd)) {
        // bad delimiter
        throw new Error('emitting on bad namespace');
      }

      var names = event, name = '';
      var a = 0, b = names.indexOf(d);
      var queued = 0; //number of items added to queue
      var toQueue = 0;
      
      name = names.substr(a, b);
      names = names.substr(b+dlen);
      
      // the queue is emitBuffer;
      // emitTrees.push(eventsTree); //add the current level
      // emitNames; //add the first name

      // to prevent sub-string later
      if (eventsTree['*']) {
        emitTrees.push(eventsTree['*']);
        emitNames.push('*');
        queued++;
      }
      if (eventsTree[name]) {
        emitTrees.push(eventsTree[name]);
        emitNames.push(name);
        queued++;
      }

      // traverse the namespace
      while(~b) {
        name = names.substr(a,b);
        names = names.substr(b+dlen); //+dlen for the length of the delimiter

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
        b = names.indexOf(d);
        
        if (~~b) { // there are no more names.
          
          // go ahead and emit everything in the queue.
          while (queued) {
            
            pop = emitTrees.shift();
            levelName = emitNames.shift();
            queued--;
            
            if (eventsList[levelName]) {
              fn = eventsList[levelName];
              if (typeof fn === 'function' ) {
                fn.apply(this, arguments);
              }
              else {
                for (i = 0, l = fn.length; i < l; i++) {
                  fn[i].apply(this, arguments);
                }
              }
            }
          }
          // end of ~~b
        }
        // if there are more delimiters, then we loop further
        // we do all the stuff up top, so nothing to do here
      }
      //while ends
    } 
    else {
      // this is a none-namespaced, non-wildcard
      _emitter.apply(this, arguments);

      for (var ifl = 0, l = flatwildListeners.length; ifl < l; ifl++) {
        flatwildListeners[ifl].apply(this, arguments);
      }
    }

    for (var ial = 0, l = anyListeners.length; ial < l; ial++) {
      anyListeners[ial].apply(this, arguments);
    }

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
      var a = 0, b = event.indexOf(d);
      var name = event.substr(a,b);
      var handle = event.substr(b+dlen);
      var tree = eventsTree;
      if (!tree[name]) {
        tree[name] = true;
      }

      while (~b) {
        // check for bad * errors TODO
        // try to delay allocating {}
        if (!tree[name]) { 
          tree = tree[name] = true;
        }
        else if (tree[name] === true) {
          tree = tree[name] = {};
        }
        else {
          tree = tree[name];
          continue;
        }
        name = handle.substr(a,b);
        handle = handle.substr(b+dlen);
        b = handle.indexOf(d);
        if (!~b) {
          if (!tree[name]) { 
            tree[name] = true;
          }
          else if (tree[name] === true) {
            tree[name] = {};
          }
          else {
            break;
          }
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
      eventsTree[event] = true;
      eventsList[event] = callback;
    }
    else if(Array.isArray(handler)) {
      
      eventsList[event].push(callback);
      
      if (maxListeners > 0 && handler.length === maxListeners && !handler.warned) {
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
