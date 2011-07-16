;!function(environment, undefined) {

  var isArray = Array.isArray;

  function e(conf) {
    this.eventsLength = 1;
    this.events = {};
    this.listenerTree = {};
    this.handles = new Array(100);
  }

  e.prototype.delimiter = '.';

  e.prototype.emit = function(type) {

    var handler = this.events[type];
    var args, listeners;

    if (~type.indexOf('*')) {

      var d = this.delimiter;
      var dlen = d.length;
      var dd = d+d;
      
      // check for errors
      if (type.charAt(0) === d ||
          type.charAt(type.length-1) === d ||
          ~type.indexOf(dd)) {
        // bad delimiter
        throw new Error('bad namespace');
      }
      
      type = type.split(d);

      var tree = this.listenerTree;

      function wildcard() {
        name = type.shift();

        for (var node in tree) {
          if(tree[node][name]) {
            //handles.push(reduce(tree[node][name]));
          }
        }
        return handles;
      }

      function reduce(tree) {
      
        name = type.shift();
      
        if (name === '*') {
          return wildcard();
        }
        
        if (type.length === 1 && tree[name]) {
          handlesLength++;
          return tree[name];
        }
        else {
          reduce(tree[name]);
        }

        
      }
      
      handler = reduce(tree);
    }

    if (typeof handler === 'function') {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
      }
      return true;
    }
    else if(handler) {

      args = Array.prototype.slice.call(arguments, 1);
      listeners = handler.slice();

      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
      return true;

    } 
    else {
      return false;
    }
  };

  // Returns handle needed for ignore function
  e.prototype.on = function(type, listener) {

    if(this.events['newListener']) {
      this.emit('newListener', type, listener);
    }

    if (typeof this.events[type] === 'undefined') {
      this.events[type] = listener;
    } else if (typeof handler === 'function') {
      this.events[type] = [this.events[type], listener];
    } else {
      this.events[type][++this.eventsLength] = listener;
    }

    if (~type.indexOf(this.delimiter)) {
      this.growListenerTree(type, this.events[type ]);
    }

    return this;

  };

  e.prototype.addListener = e.prototype.on;

  e.prototype.growListenerTree = function(event, listeners) {

    var d = this.delimiter;
    var dlen = d.length;
    var dd = d+d;
    var tmp;

    // check for errors
    if (type.charAt(0) === d ||
        type.charAt(type.length-1) === d ||
        ~type.indexOf(dd)) {
      // bad delimiter
      throw new Error('bad namespace');
    }

    type = type.split(d);

    var tree = this.listenerTree;
    var name = true;

    while (name) {
      name = type.shift();
      if (type.length === 1) {
        return tree[name] = listeners;
      }

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];
    }
    
    return true;

  };

  e.prototype.removeListener = function(topic, callback) {
    if (this.events[topic]) {
      topic = this.events[topic];
      var len = topic.length;

      while (len--) {
        if (topic[len] === callback) {
          topic.splice(len-1, 1);
        }
      }
    }
    return this;
  };

  environment.EventEmitter2 = e;

}(typeof exports === 'undefined' ? window : exports);
