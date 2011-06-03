;!function(exports, undefined) {

  exports.EventEmitter2 = EventEmitter2;

  function EventEmitter2(conf) {
    if (conf) {
      if (conf.delimiter === '*') {
        throw new Error('The event can not be delimited by the "*" (wild-card) character.');
      }
    }
    this._delimiter = conf ? conf.delimiter : '.';
    this._maxListeners = conf ? conf.maxListeners : 10;
    this._events = {};
  };

  EventEmitter2.prototype.addListener = function(event, listener) {

    var name, ns = this._events;

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
    this.many(event, listener, 1);
  };

  EventEmitter2.prototype.many = function(event, listener, ttl) {

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

    var self = this, args = arguments, i = 0, j = 0;

    function invokeListeners(val) {
      for (var k = 0, l = val._listeners.length; k < l; k++) {
        val._listeners[k].apply(this, args);
      }
      return true;
    }

    // If there is a delimiter in the event name
    if (~event.indexOf(this._delimiter)) {

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
        var part = name[i],
            newSets = [];

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
    return true;
  };

  EventEmitter2.prototype.removeListener = function(event) { this._events[event] = {} };
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

}(typeof exports === 'undefined' ? window : exports);
