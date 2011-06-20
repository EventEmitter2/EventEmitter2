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

    var d = this._delimiter;

    if(event[event.length-1] === d || event[0] === d) {
      this.nameError();
    }

    this._events[event] || (this._events[event] = { _listeners: [], ttl: null });

    if (this._events[event]._listeners.length === this.maxListeners) {
      this.emit('maxListeners', event);
      return;
    }

    this._events[event]._listeners.push(listener);

    this.emit('newListener', event, listener);

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

  EventEmitter2.prototype.emit = function() {

    var event = arguments[0];

    var self = this;
    var key;
    var d = this._delimiter;
    var listeners = [];

    //arguments[0] = arguments[0].join ? arguments[0].join(d) : arguments[0];

    if(event[event.length-1] === d || event[0] === d) {
      this.nameError();
    }

    event = ~event.indexOf(d) ? event.split(d) : [event]; // split event if ambigious. make array.

    for(var e in self._events) {

      var listenerList = self._events[e]._listeners, match = true;

      key = e.split(d); // split the name.

      for(var i = 0, l = event.length; i < l; i++) {

        if(key[i] && !this._caseSensitive) { // not case sensitive.
          event[i].toLowerCase();
          key[i].toLowerCase();
        }

        if(!key[i] || event[i] !== key[i] && event[i] !== '*' && key[i] !== '*') {
          match = false;
          break;
        }
      }

      // if this is a pure wild card or match, lets capture the listeners.
      if(e === '*' || match) { listeners = listeners.concat(listenerList); }
    }

    for(var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, arguments);
    }

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
