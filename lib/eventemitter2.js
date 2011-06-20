// TODO:
// - Update comments.
// - Update *removeListener* to support namespaced events - low prio
// - Update *listener* to support namespaced events - low prio


;!function(root) {

  var EventEmitter2 = root.EventEmitter2 = function EventEmitter2(conf) {
    this.initializeEvents(conf);
  };

  EventEmitter2.prototype.initializeEvents = function(conf) {
    conf = conf || {};
    var me = this;
    me.setEventDelimiter(conf.delimiter);
    me._eventCaseSensitive = conf.eventCaseSensitive || false;
    me._eventDelimiter = conf.eventDelimiter || '.';
    me._maxListeners = conf.maxListeners === 0 ? 0 : conf.maxListeners || 10;
    me._listeners = {};
    return me;
  }

  EventEmitter2.prototype.addListener = function(event, listener) {
    var me = this;

    // If the listener is not a function throw an error. A listener that is not
    // a function can not be called when an event is emitted and therefor is
    // not allowed to be added.
    if ('function' !== typeof listener) {
      throw new Error('addListener only accepts instances of Function');
    }

    // If *_listeners* is undefined invoke *initializeEvents* to set the
    // default properties.
    if (!me._listeners) me.initializeEvents();

    // Set variables.
    var delimiter = me._eventDelimiter,
        caseSensative = me._eventCaseSensitive,
        listeners = me._listeners,
        maxListeners = me._maxListeners,
        event = caseSensative ? event.toLowerCase() : event,
        ns, exploreNs = listeners,
        listenToEvent, eventListeners;

    // If an event starts or ends with a delimiter character throw an error.
    // Starting or ending an event with a delimiter character creates empty
    // namespaces which don't work and therefor are not allowed.
    if (event[event.length-1] === delimiter || event[0] === delimiter) {
      me.eventNameError('addListener');
      return false;
    }

    // If the event is namespaced loop through the namespaces, set seperate
    // events for each namespace and set *listenToEvent* to the last
    // namespace to attach the listener function to this event after the loop.
    if (~event.indexOf(delimiter)) {

      // Split the event into a namespace array for looping.
      ns = event.split(delimiter);

      // If an event contains an empty namespace throw an error. Using two or
      // more delimiters like for example ".." is incorrect and therefor not
      // allowed.
      if (~ns.indexOf('')) {
        me.eventNameError('addListener');
        return false;
      }

      // Loop through the namespaces.
      for (var i = 0, l = ns.length; i < l; i++) {

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
    me.emit('newListener', event, listener);

    // If the max amount of listeners has been reached signal and return to
    // cancel the addition of this new event.
    if (eventListeners.length >= maxListeners) {
      me.emit('maxListeners', event);
      return me;
    }

    // Add the listener to the event.
    eventListeners.push(listener);
    return me;
  };

  EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;

  EventEmitter2.prototype.once = function(event, listener) {
    this.many(event, 1, listener);
    return this;
  };

  EventEmitter2.prototype.many = function(event, ttl, listener) {
    var me = this;

    me.addListener(event, function() {
      if(ttl-- == 0) {
        me.removeListener(event, listener);
      } else {
        listener.apply(null, arguments);
      }
    });

    return me;
  };

  EventEmitter2.prototype.emit = function(event) {
    var me = this,
        args = arguments,
        i = 0,
        delimiter = me._eventDelimiter,
        caseSensitive = me._eventCaseSensitive,
        listeners = me._listeners,
        ns, exploreNs = [listeners], collectedListeners = [],
        invoked = false;

    // If no listeners are defined the emit will not be able to invoke a
    // function. Therefore return *invoked* to exit.
    if (!listeners) return invoked;

    // If an event starts or ends with a delimiter character throw an error.
    // Starting or ending an event with a delimiter character creates empty
    // namespaces which don't work and therefor are not allowed.
    if (event[event.length-1] === delimiter || event[0] === delimiter) {
      me.eventNameError('emit');
      return false;
    }

    // If the event is namespaced loop through the namespaces, find all the
    // listeners for the namespaces and wildcards and add them to the 
    // *collectedListeners* array for listener invocation after the loop.
    if (~event.indexOf(delimiter) || event === '*') {

      // Split the event into a namespace array for looping.
      ns = event.split(delimiter);

      // If an event contains an empty namespace throw an error. Using two or
      // more delimiters like for example ".." is incorrect and therefor not
      // allowed.
      if (~ns.indexOf('')) {
        me.eventNameError('addListener');
        return false;
      }

      // Loop through the namespaces.
      for (i = 0; i < ns.length; i++) {

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
              name = caseSensitive ? exploredNs._name.toLowerCase() : exploredNs._name;

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

    // If the event is not namespaced collect all the listeners for this
    // particular event and from the wildcard event and add them to
    // the *collectedListeners* array for listener invocation.
    else if (event !== '*' && event !== 'all' && listeners[event] && listeners[event]._fn.length > 0) {
      if (listeners['*'] && listeners['*']._fn.length > 0) {
        collectedListeners = collectedListeners.concat(listeners['*']._fn);
      }
      collectedListeners = collectedListeners.concat(listeners[event]._fn);
    }

    // If the event is "all" fire all events?
    if (event === 'all') {}

    // Loop through the collected listeners and invoke them.
    for (i = 0, l = collectedListeners.length; i < l; i++) {
      collectedListeners[i].apply(me, args);
      invoked = true;
    }

    // If a listener "all" is defined in *events* invoke its functions.
    if (listeners['all'] && listeners['all']._fn.length > 0){
      for (i = 0, l = listeners['all']._fn.length; i < l; i++) {
        listeners['all']._fn[i].apply(me, args);
        invoked = true;
      }
    }

    return invoked;
  };

  EventEmitter2.prototype.removeListener = function(event, listener) {
    var me = this;

    if(listener && me._listeners[event] && me._listeners[event]._fn) {
      var listeners = me._listeners[event]._fn;

      for(var i = 0, l = listeners.length; i < l; i++) {
        if(listener === listeners[i]) {
          // Break out and return the removed listener.
          return listeners.splice(i, 1);
        }
      }
    } else {
      me._listeners[event] = {};
    }
    return me;
  };

  EventEmitter2.prototype.un = EventEmitter2.prototype.removeListener;

  EventEmitter2.prototype.removeAllListeners = function() {
    this._listeners = {};
    return this;
  };

  EventEmitter2.prototype.setEventDelimiter = function(delimiter) {
    if (delimiter === '*' && delimiter.length === 1) {
      throw new Error('setEventDelimiter doesn\'t accept a "*" (wild-card) character');
    } else {
      this._eventDelimiter = delimiter;
    }
    return this;
  };

  EventEmitter2.prototype.setEventCaseSensitive = function(caseSensative) {
    this._eventCaseSensitive = caseSensative;
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
      return false;
    }
  };

  EventEmitter2.prototype.eventNameError = function(fn) {
    throw new Error(fn + ' doesn\'t accept empty namespaces or events starting or ending with a "' + this._eventDelimiter + '" (delimiter) character ');
  };

}(typeof exports === 'undefined' ? window : exports);
