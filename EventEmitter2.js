
;(function(exports, undefined) {

  function invokeListeners(val) {
    if (val && val._listneners) {
      for (var k = 0, l = val._listeners.length; k < l; k++) {
        val._listeners[k].apply(this, args);
      }
      return true;
    }
  }

  exports.EventVat = function EventEmitter2(conf) {
    if(conf) {
      if(conf.delimiter === '*') {
        throw new Error('The event can not be delimited by the "*" (wild-card) character.')
      }
    }
    this._delimiter = conf ? conf.delimiter : '/';
    this._events = {};
  };

  EventEmitter2.prototype.addListener = function(event, listener, ttl) {

    var name, ns = this._events;

    // Signal that a new listener is being added.
    this.emit('newListener', event, listener);

    // the name has a delimiter
    if(~event.indexOf(this._delimiter)) {

      //split the name into an array
      name = event.split(this._delimiter);
    
      // continue to build out additional namespaces and attach the listener to them
      for(var i = 0, l = name.length; i < l; i++) {
      
        // get the namespace
        ns = ns[name[i]] || (ns[name[i]] = {});
      
        // if this is a wild card or the completed ns, add the event
        if(i === name.length) {
          ns._listeners ? ns._listeners.push(listener) : ns._listeners = [listener];
          ns._ttl = ttl;
          ns._ttd = 0;
        }
      }
    }
  
    // if the name does not have a delimiter
    else {

      // get a handle to the event
      var e = ns[event] || (ns[event] = {});

      e._listeners ? e._listeners.push(listener) : e._listeners = [listener];
      e._ttl = ttl;
      e._ttd = 0;
    }

  };

  EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;

  EventEmitter2.prototype.once = function() {
    this.addListener(arguments, 1);
  };

  EventEmitter2.prototype.emit = function(event) {

    // get all the args except the event, make it a real array
    var args = [].slice.call(arguments).slice(1);

  

    // if there is a delimiter in the event name
    if(~event.indexOf(this._delimiter)) {

      //split the name into an array
      name = event.split(this._delimiter);

      var explore = [this._events],
          invoked = false;
        
      for (var i = 0; i < name.length; i++) {
        //
        // Iterate over the parts of the potentially namespaced
        // event. 
        //
        //     emit('foo/*/bazz') ==> ['foo', '*', 'bazz'] 
        //
        var part = name[i], newSets = [], removeAt = [];
      
        for (var j = 0; j < explore.length; j++) {
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
              for (var key in ns) {
                //
                // Remark: This could cause some collisions for `_listeners`,
                // `_ttl`, and `_ttd`. 
                //
                invokeListeners(ns[key]);
              }
              invoked = true;
            }
            else {
              if (invokeListeners(ns[part])) {
                invoked = true;
              }
            
              if (invokeListeners(ns['*'])) {
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
              
                if (invokeListeners(ns['*'])) {
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
              for (var key in ns) {
                if (ns.hasOwnProperty(key)) {
                  newSets.push(ns[key]);
                }
              }

              if (invokeListeners(ns['*'])) {
                invoked = true;
              }
            
              removeAt.push(j);
            }
          }
        }
      
        for (var j = 0; j < removeAt.length; j++) {
          //
          // Remove stale sets that are no longer of interest.
          //
          explore.splice(j, 1);
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
    else {
    
      if (!this._events[event]) {
        return false;
      }
    
      // get a handle to the listeners
      var listeners = this._events[event]._listeners || null;
    
      if (!listeners) {
        return false;
      }
    
      // fire off each of them
      for(var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    }
  }

  EventEmitter2.prototype.removeListener = function() {};
  EventEmitter2.prototype.removeAllListeners = function() {};

  EventEmitter2.prototype.listeners = function() {};

}((typeof exports === 'undefined') ? window : exports));
