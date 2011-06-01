
;(function(exports, undefined) {

  var EventEmitter2 = exports.EventEmitter2 = function(conf) {
    if(conf) {
      if(conf.delimiter === '*') {
        throw new Error('The event can not be delimited by the "*" (wild-card) character.');
      }
    }
    this._delimiter = conf ? conf.delimiter : '/';
    this._maxListeners = conf ? conf.maxListeners : 10;
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
       if(i === name.length - 1) {
         if(ns._listeners && ns._listeners.length === this.maxListeners) {
           this.emit('maxListeners', event);
           return;
         }
         ns._listeners ? ns._listeners.push(listener) : ns._listeners = [listener];
         ns._ttl = ttl;
       }
     }
    }

    // if the name does not have a delimiter
    else {

     // get a handle to the event
     var e = ns[event] || (ns[event] = {});

     e._listeners ? e._listeners.push(listener) : e._listeners = [listener];
     e._ttl = ttl;
    }

  };

  EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
  
  EventEmitter2.prototype.once = function(event, listener) {
    this.addListener(event, listener, 1);
  };
  
  EventEmitter2.prototype.emit = function(event) {
  
    function invokeListeners(val, args) {
      if (val && val._listeners) { // To-Do: this check should be hoisted upward.
        if(val._ttl !== 0) {
          for (var k = 0, l = val._listeners.length; k < l; k++) {
            val._listeners[k].apply(this, args);
            val._ttl -= 1;
          }
          return true;
        }
      }
    }
  
    // get all the args except the event, make it a real array
    var args = arguments, i = 0, j = 0;
  
    // if there is a delimiter in the event name
    if(~event.indexOf(this._delimiter)) {
  
      //split the name into an array
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
            newSets = [], 
            removeAt = [];
      
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
                //
                // Remark: This could cause some collisions for `_listeners`, and `_ttl`. 
                //
                invokeListeners(ns[key], args);
              }
              invoked = true;
            }
            else {
              if (invokeListeners(ns[part], args)) {
                invoked = true;
              }
            
              if (invokeListeners(ns['*'], args)) {
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
              
                if (invokeListeners(ns['*'], args)) {
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
  
              if (invokeListeners(ns['*'], args)) {
                invoked = true;
              }
            
              removeAt.push(j);
            }
          }
        }
      
        for (j = 0; j < removeAt.length; j++) {
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
      for(i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    }
    return true;
  };

  EventEmitter2.prototype.removeListener = function(event) {
    this.listeners(event, true);
  };

  EventEmitter2.prototype.removeAllListeners = function() {
    for(var event in this._events) {
      this.listeners(event, null, true);
    }
  };
  
  EventEmitter2.prototype.setMaxListeners = function(n) {
    this.maxListeners = n;
  }
  
  EventEmitter2.prototype.listeners = function(event, listener, removeAllListeners) {
  
    var listeners = [], i = 0, j = 0; // the array of listeners to return.
  
    // if there is a delimiter in the event name
    if(~event.indexOf(this._delimiter)) {
  
      //split the name into an array
      name = event.split(this._delimiter);
  
      // continue to build out additional namespaces and attach the listener to them
      for (i = 0; i < name.length; i++) {
  
        // get the namespace
        ns = ns[name[i]] || (ns[name[i]] = {});
        
        //
        // if this is a wild card or the completed ns, remove the event,
        // also reset the times to live and the time to die.
        //
        if(ns._listeners) {
          
          //
          // if there is only one argument to this method, we are just
          // looking to see what listeners exist and then report on that.
          //
          if(arguments.length === 1) {
            listeners.push(ns._listeners);
          } else {
            
            //
            // if we have some arguments, we're considering deleteing some
            // or possibly all of the listeners associated with an event.
            //
            if(removeAllListeners) {
              ns = null;
            }
            else {
              for (j = 0; j < ns._listeners.length; j++) {
                if(ns._listeners[j] === listener) {
                  ns = null;
                }
              }
            }
          }
        }
      }
    }
    else {
  
      //
      // this is a simple event, no need to deconstruct the name,
      // lets just kill any listeners associated with it.
      //
      var e = this._events[event];
  
      if(!removeEvents) {     
        listeners.push(ns._listeners);
      }
      else {
        if(removeAllListeners) {
          e = null;
        }
        else {
          for (i = 0; i < e._listeners.length; i++) {
            if(e._listeners[i] === listener) {
              e = null; 
            }
          }
        }
      }
    }
  
    return listeners;
  };

}((typeof exports === 'undefined') ? window : exports));
