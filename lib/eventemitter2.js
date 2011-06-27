;!function(root, undefined) {

  var EventEmitter2 = root.EventEmitter2 = function EventEmitter2(conf) {

    // If *_listeners* is undefined invoke *initializeEvents* to set the
    // default properties.
    if (!this._listeners) this.initializeEvents(conf);
  };

  EventEmitter2.prototype.initializeEvents = function(conf) {
    conf = conf || {};
    var self = this;

    conf.delimiter = conf.delimiter || '.';

    if (conf.delimiter === '*' && conf.delimiter.length === 1) {
      throw new Error('Can\'t use \'*\' (wild-card) as delimiter.');
    } else {
      self._delimiter = conf.delimiter;
    }

    self._caseSensitive = typeof conf.caseSensitive === 'undefined' ? true : conf.caseSensitive;
    self._maxListeners = conf.maxListeners === 0 ? 0 : conf.maxListeners || 10;
    self._listeners = {};
    self._allListenerFn = [];
    return self;
  }

  EventEmitter2.prototype.addListener = function(event, fn) {
    var self = this;

    // If *fn* is not a function throw an error. An *fn* that is not a function
    // can not be invoked when an event is emitted and therefor is not allowed
    // to be added.
    if ('function' !== typeof fn) {
      throw new Error('addListener only accepts instances of Function');
    }

    // If *_listeners* is undefined invoke *initializeEvents* to set the
    // default properties.
    if (!self._listeners) self.initializeEvents();

    // Set variables.
    var i = 0,
        delimiter = self._delimiter,
        doubleDelimiter = delimiter + delimiter,
        caseSensitive = self._caseSensitive,
        listeners = self._listeners,
        maxListeners = self._maxListeners,
        event = caseSensitive ? event : event.toLowerCase(),
        namespaced = ~event.indexOf(delimiter),
        ns, exploreNs = listeners,
        listenToEvent, eventListeners;

    // If the event is namespaced loop through the namespaces, set seperate
    // events for each namespace and set *listenToEvent* to the last
    // namespace to attach the listener function to this event after the loop.
    if (namespaced) {

      // If an event starts or ends with a delimiter character or two or more
      // delimiter characters are used after each other throw an error.
      // Starting or ending an event with a delimiter character or combining
      // characters creates empty namespaces which don't work and therefor are
      // not allowed.
      if (event[event.length - 1] === delimiter || event[0] === delimiter || ~event.indexOf(doubleDelimiter)) {
        self.eventNameError('addListener');
        return false;
      }

      // Split the event into a namespace array for looping.
      ns = event.split(delimiter);

      // Loop through the namespaces.
      for (i = 0, l = ns.length; i < l; i++) {

        if (name.indexOf('*') !== -1 && name.length !== 1) {
          self.eventNameError('addListener');
          return false;
        }

        // If the event is undefined in *exploreNs* it means it doesn't exist
        // in *listeners* so a new event should be created.
        if (!exploreNs[ns[i]]) {
          exploreNs[ns[i]] = {
              _name: ns[i],
              _fn: [],
              _ns: {}
            };
        }

        // If the loop is at the end set *listenToEvent* to the current
        // namespace - which is the last one - to attach the listener to this
        // event. If the loop is not at the end rebase *exploreNs* to loop the
        // current event's namespaces.
        if (i === ns.length - 1) {
          listenToEvent = exploreNs[ns[i]];
        } else {
          exploreNs = exploreNs[ns[i]]._ns;
        }
      }
    }

    // If the event is not namespaced set the single event and set
    // *listenToEvent* to this event to attach the listener to.
    else {

      // Check for bad wildcard location
      if (event.indexOf('*') !== -1 && event.length !== 1) {
        self.eventNameError('addListener');
        return false;
      }

      // If the event is undefined in *listeners* it means it doesn't exist
      // so a new event should be created.
      if (!listeners[event]) {
        listeners[event] = {
          _name: event,
          _fn: [],
          _ns: {}
        };
      }

      // Set *listenToEvent* to the current event to attach the listener to.
      listenToEvent = listeners[event];
    }

    eventListeners = listenToEvent._fn;

    // Signal that a new listener is being added.
    self.emit('newListener', event, fn);

    // If the max amount of listeners has been reached signal and return to
    // cancel the addition of this new listener.
    if (eventListeners.length >= maxListeners) {
      self.emit('maxListeners', event);
      return self;
    }

    // Add the function to the event listener collection.
    eventListeners.push(fn);
    return self;
  };

  EventEmitter2.prototype.onAny = function(fn) {

    // If *_listeners* is undefined invoke *initializeEvents* to set the
    // default properties.
    if (!this._listeners) this.initializeEvents();

    // Add the function to the event listener collection.
    this._allListenerFn.push(fn);
  };

  EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;

  EventEmitter2.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter2.prototype.many = function(event, ttl, fn) {
    var self = this;

    self.addListener(event, function() {
      if(ttl-- == 0) {
        self.removeListener(event, fn);
      } else {
        fn.apply(null, arguments);
      }
    });

    return self;
  };

  EventEmitter2.prototype.emit = function(event) {
    var self = this,
        args = arguments,
        i = 0,
        delimiter = self._delimiter,
        doubleDelimiter = delimiter + delimiter,
        caseSensitive = self._caseSensitive,
        listeners = self._listeners,
        event = caseSensitive ? event : event.toLowerCase(),
        namespaced = ~event.indexOf(delimiter),
        ns, exploreNs = [listeners], collectedListeners = [],
        invoked = false;

    // Following, EE convention on handling error events
    // Should wrap this so we can call it on any name/ns
    if (event === 'error') { 
      // if we don't have onAny, or error listeners, throw the error
      if (!listeners || !listeners.error || 
          (!listeners.error._fn && !listeners.error._fn.length))
      {
        if (arguments[1] instanceof Error) {
          // if this actually passed up an Error
          throw arguments[1]; // Unhandled 'error' event
        } 
        else {
          // or we just say some error happened
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        //don't forget to return invoked
        return invoked;
      }
    }

    // If no listeners are defined the emit will not be able to invoke a
    // function. Therefore return *invoked* to exit.
    if (!listeners) return invoked;

    // If the event is namespaced loop through the namespaces, find all the
    // listeners for the namespaces and wildcards and add them to the 
    // *collectedListeners* array for listener invocation after the loop.
    if (namespaced || event === '*') {

      // If an event starts or ends with a delimiter character or two or more
      // delimiter characters are used after each other throw an error.
      // Starting or ending an event with a delimiter character or combining
      // characters creates empty namespaces which don't work and therefor are
      // not allowed.
      if (event[event.length - 1] === delimiter || event[0] === delimiter || ~event.indexOf(doubleDelimiter)) {
        self.eventNameError('emit');
        return false;
      }

      // Split the event into a namespace array for looping.
      ns = event.split(delimiter);

      // Loop through the namespaces.
      for (i = 0; i < ns.length; i++) {

        // Check for bad wildcard location (on each name)
        if (ns[i].indexOf('*') !== -1 && ns[i].length !== 1) {
          self.eventNameError('emit');
          return false;
        }

        // While looping through the namespace array loop through *exploreNs*
        // with *i* as well. This is basicaly the same as looping through the
        // the different levels of *events*. *collectedNs* is used to collect
        // all the namespaces that are going to be explored for the next level
        // of *events*.
        var currentNs = ns[i],
            currentExploreNs = exploreNs[i],
            collectedNs = [];

        // Loop through the current level of *events*.
        for (var key1 in currentExploreNs) {

          // Set the current namespace in *events* that is being explored.
          var exploredNs = currentExploreNs[key1],
              name = caseSensitive ? exploredNs._name : exploredNs._name.toLowerCase();

          // If there is a match for the namespace or a wildcard collect the
          // next level of namespaces or collect the listeners of this
          // particular namespace.
          if (currentNs === '*' || (name === currentNs || name === '*')) {

            // If the loop is at the end collect the listeners for this
            // particular event and add them to the *collectedListeners* array
            // for listener invocation after the loop. If the loop is not at
            // the end collect the next level of namespaces.
            if (i === ns.length - 1) {
              var listeners = exploredNs._fn;
              if (listeners.length > 0) {
                collectedListeners = collectedListeners.concat(listeners);
              }
            } else {
              for (var key2 in exploredNs._ns) {
                collectedNs.push(exploredNs._ns[key2]);
              }
            }
          }
        }

        exploreNs.push(collectedNs);
      }
    }

    // If the event is not namespaced collect all the functions for this
    // particular event and from the wildcard event and add them to
    // the *collectedListeners* array for invocation.
    else {

      // Check for bad wildcard location
      if (event.indexOf('*') !== -1 && event.length !== 1) {
        self.eventNameError('emit');
        return false;
      }

      if (listeners[event] && listeners[event]._fn.length > 0) {
        collectedListeners = collectedListeners.concat(listeners[event]._fn);
      }
      if (listeners['*'] && listeners['*']._fn.length > 0) {
        collectedListeners = collectedListeners.concat(listeners['*']._fn);
      }
    }

    // Loop through the collected functions and invoke them.
    if (collectedListeners.length > 0) {
      for (i = 0, l = collectedListeners.length; i < l; i++) {
        collectedListeners[i].apply(self, args);
        invoked = true;
      }
    }

    // Loop through the *_allListnerFn* functions and invoke them.
    if (self._allListenerFn && self._allListenerFn.length > 0) {
      for (i = 0, l = self._allListenerFn.length; i < l; i++) {
        self._allListenerFn[i].apply(self, args);
        invoked = true;
      }
    }

    return invoked;
  };

  EventEmitter2.prototype.emitAll = function() {};

  EventEmitter2.prototype.removeListener = function(event, fn) {
    if (fn && this._listeners[event] && this._listeners[event]._fn) {
      var fns = this._listeners[event]._fn;
      for(var i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          return fns.splice(i, 1);
        }
      }
    } else {
      this._listeners[event] = {};
    }
    return this;
  };

  EventEmitter2.prototype.un = EventEmitter2.prototype.removeListener;

  EventEmitter2.prototype.unAny = function(fn) {
    if (fn && this._allListenerFn && this._allListenerFn.length > 0) {
      var fns = this._allListenerFn;
      for(var i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          return fns.splice(i, 1);
        }
      }
    } else {
      this._allListenerFn = [];
    }
  };

  EventEmitter2.prototype.removeAllListeners = function() {
    this._listeners = {};
    this._allListenerFn = [];
    return this;
  };

  EventEmitter2.prototype.setMaxListeners = function(n) {
    this._maxListeners = n;
    return this;
  };

  EventEmitter2.prototype.listeners = function(event) {
    if(this._listeners[event]) {
      return this._listeners[event]._fn;
    } else {
      return [];
    }
  };

  EventEmitter2.prototype.listenersAny = function() {
    return this._allListenerFn;
  }

  EventEmitter2.prototype.eventNameError = function(fn) {
    throw new Error(fn + ' doesn\'t accept empty namespaces or events starting or ending with a "' + this._delimiter + '" (delimiter) character ');
  };

}(typeof exports === 'undefined' ? window : exports);
