;!function(exports, undefined) {

  exports.EventEmitter2 = EventEmitter2;

  function EventEmitter2(conf) {
    conf = conf || {};
    if (conf.delimiter === '*') {
      throw new Error('The event can not be delimited by the "*" (wild-card) character.');
    }
    this._caseSensitive = conf.caseSensitive;
    this._delimiter = conf.delimiter || '.';
    this._maxListeners = conf.maxListeners === 0 ? 0 : conf.maxListeners || 10;
    this._events = {};
  };

  EventEmitter2.prototype.addListener = function(event, listener) {

    var name, ns = this._events;
    
    if(event[event.length-1] === this._delimiter || event[0] === this._delimiter) {
      this.nameError();
    }
    
    if(this._caseSensitive === true) {
      event = event.toLowerCase();
    }

    // Signal that a new listener is being added.
    this.emit('newListener', event, listener);

    // the name has a delimiter
    if (~event.indexOf(this._delimiter)) {

      //split the name into an array
      name = event.split(this._delimiter);

      // continue to build out additional namespaces and attach the listener to them
      for(var i = 0, l = name.length; i < l; i++) {

        // get the namespace
        ns = ns[name[i]] || (ns[name[i]] = {});
      }
    }

    // if the name does not have a delimiter
    else {

      // get a handle to the event
      ns = ns[event] || (ns[event] = {});
    }

    if (ns._listeners && ns._listeners.length === this.maxListeners) {
      this.emit('maxListeners', event);
      return;
    }
    ns._listeners ? ns._listeners.push(listener) : ns._listeners = [listener];
  };

  EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;

  EventEmitter2.prototype.once = function(event, listener) {
    this.many(event, 1, listener);
  };

  EventEmitter2.prototype.many = function(event, ttl, listener) {

    var self = this;

    this.addListener(event, function() {
      if(ttl-- == 0) {
        self.removeListener(event, listener);
      }
      else {
        listener.apply(null, arguments);
      }
    });
  };

  EventEmitter2.prototype.emit = function(event) {

    if(event[event.length-1] === this._delimiter || event[0] === this._delimiter) {
      this.nameError();
    }

    var self = this, args = arguments, i = 0, j = 0;

    function invokeListeners(val) {
      for (var k = 0, l = val._listeners.length; k < l; k++) {
        val._listeners[k].apply(this, args);
      }
      return true;
    }

    // If there is a delimiter in the event name
    if (~event.indexOf(this._delimiter) || event === '*') {

      // Split the name into an array
      name = event.split(this._delimiter);

      var explore = [this._events],
          invoked = false,
          key = null;

      for (i = 0; i < name.length; i++) {
        //
        // Iterate over the parts of the potentially namespaced
        // event.
        //
        //     emit('foo/*/bazz') ==> ['foo', '*', 'bazz']
        //
        var part = self._caseSensitive === true ? name[i].toLowerCase() : name[i];
        var newSets = [];

        for (j = 0; j < explore.length; j++) {
          //
          // Iterative "unkown" set exploration: Iterate over each "unknown"
          // set of objects in the events tree. If a wildcard is discovered,
          // append that object to the unknown set and continue exploration.
          //
          var ns = explore[j];

          if (i === name.length - 1) {
            //
            // Then if we are at the end of the iteration
            // invoke all of the listeners, if not, continue
            // iterating deeper in the object
            //
            if (part === '*') {
              for (key in ns) {
                if (ns.hasOwnProperty(key)) {
                  //
                  // Remark: This could cause some collisions for `_listeners`.
                  //
                  if (ns[key] && ns[key]._listeners) {
                    invokeListeners(ns[key]);
                  }
                }
              }
              invoked = true;
            }
            else {
              if (ns[part] && ns[part]._listeners && invokeListeners(ns[part])) {
                invoked = true;
              }
              else if (ns['*'] && ns['*']._listeners && invokeListeners(ns['*'])) {
                invoked = true;
              }
            }
          }
          else {
            if (part !== '*') {

              if (!ns[part] && !ns['*']) {
                //
                // If it's not a wild card and there isn't a wild
                // card stored and the exact key isn't at the
                // next step of the events object, break out
                // of the loop and end evaluation.
                //
                continue;
              }

              if (ns[part]) {
                //
                // If it's not a wild card, but there is an exact
                // match for this part of the namespaced event.
                //
                if (ns['*']) {
                  newSets.push(ns['*']);
                }

                explore[j] = explore[j][part];
              }
              else if (ns['*']) {
                //
                // If the part of the namespaced event is not a wildcard,
                // but the set we are currently exploring has a wildcard
                // at this level, nest deeper for that particular set.
                //
                explore[j] = explore[j]['*'];

                if (ns['*'] && ns['*']._listeners && invokeListeners(ns['*'])) {
                  invoked = true;
                }
              }
            }
            else {
              //
              // Otherwise, this part of the namespaced event is a 'wildcard',
              // in which case, we iterate over the keys of the current set,
              // and add those objects to the set to be added to the "unknown" set
              // after this level of exploration has completed.
              //
              for (key in ns) {
                if (ns.hasOwnProperty(key)) {
                  newSets.push(ns[key]);
                }
              }

              if (ns['*'] && ns['*']._listeners && invokeListeners(ns['*'])) {
                invoked = true;
              }

              explore.splice(j, 1);
            }
          }
        }

        if (newSets.length) {
          //
          // If this level of exploration has yielded any new sets
          // to be explored, then concatenate those sets to the "unknown" sets.
          //
          explore = explore.concat(newSets);
        }
      }

      return invoked;
    }

    // if the name does not have a delimiter
    else if (this._events[event] && this._events[event]._listeners) {

      var listeners = this._events[event]._listeners;
      // fire off each of them
      for(i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    }
    // if this emitting event was never registerd, but a wildcard was
    else if (this._events['*'] && this._events['*']._listeners){
      invoked = invokeListeners(this._events['*']);
    }

    return true;
  };

  EventEmitter2.prototype.removeListener = function(event, listener) {
    var name = event.split(this._delimiter),
        _events = this._events;

    event = name.pop();

    for (var i = 0, len = name.length; i < len; i++) {
      _events = _events[name[i]];
      if (!_events) return;
    }

    if(listener && _events[event] && _events[event]._listeners) {
      // Make a reference to all the listeners for the event.
      var listeners = _events[event]._listeners;
      // Loop through and check the signatures to find the exact listener to remove.
      for(var i = 0, l = listeners.length; i < l; i++) {
        if(listener === listeners[i]) {
          // Break out and return the removed listener.
          return listeners.splice(i, 1);
        }
      }
    }
    else {
      _events[event] = {};
    }
  };

  EventEmitter2.prototype.removeAllListeners = function(){ this._events = {}; };

  EventEmitter2.prototype.setMaxListeners = function(n) {
    this.maxListeners = n;
  };

  EventEmitter2.prototype.listeners = function(event) {
    if(this._events[event]) {
      return this._events[event]._listeners;
    }
    else {
      return false;
    }
  };
  
  EventEmitter2.prototype.nameError = function() {
    throw new Error('Name can\'t end or begin with the "' + this._delimiter + '" character, it\'s the delimiter.');
  };

}(typeof exports === 'undefined' ? window : exports);
