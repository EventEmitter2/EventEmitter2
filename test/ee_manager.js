var Manager = (function(undefined) {
      // Cache of all topics
      var topics = {};
  
  return function ($) {
      // Iterates through listeners of events and invokes callback, 
      // passing optional arguments.      
      $.notify = function(topic, args) {
          if (topics[topic]) {
                  topic = topics[topic];
                  args = args || [];
              var len = topic.length;
  
              while (len--) {
                  topic[len].apply($, args);
              }
          }
          return $;
      };
  
      // Returns handle needed for ignore function
      $.listen = function(topic, callback) {
          if (!topics[topic]) {
              topics[topic] = [];
          }
          topics[topic].push(callback);
  
          return $;
      };
  
      // Removes listener from event its handle was assigned to
      $.ignore = function(topic, callback) {
          if (topics[topic]) {
                  topic = topics[topic];
              var len = topic.length;
  
              while (len--) {
                  if (topic[len] === callback) {
                      topic.splice(len-1, 1);
                      // break; here? duplicate handles are possible
                  }
              }
          }
          return $;
      };
  }
  }());
  var EventsManager = {}
  Manager(EventsManager);
  
  var EventsManager2 = {};
  (function(man) {
    // Cache of all topics
    var topics = {};
  
    // Iterates through all subscribers of a topic and invokes their callback,
    // passing optional arguments.
    man.publish = function(topic, args) {
      if (topics[topic]) {
        var thisTopic = topics[topic],
            thisArgs = args || [],
            thisLen = thisTopic.length;
  
        while (thisLen--) {
          thisTopic[thisLen].apply(man, thisArgs);
        }
      }
    };
  
    // Returns a handle needed for unsubscribing
    man.subscribe = function(topic, callback) {
      if (!topics[topic]) {
        topics[topic] = [];
      }
  
      topics[topic].push(callback);
  
      return {
        topic: topic,
        callback: callback
      };
    };
  
    // Removes the subscriber from the particular topic its handle was assigned to
    man.unsubscribe = function(handle) {
      var topic = handle.topic;
  
      if (topics[topic]) {
        var thisTopic = topics[topic];
  
        for (var i = 0, j = thisTopic.length; i < j; i++) {
          if (thisTopic[i] === handle.callback) {
            thisTopic.splice(i, 1);
            // break; here? duplicate handles are possible
          }
        }
      }
    };
  
  })(EventsManager2);
  
  var Manager3 = (function(undefined) {
      // Cache of all topics
      var topics = {};
  
      return function ($) {
          // Iterates through listeners of events and invokes callback, 
          // passing optional arguments.      
          $.notify = function(topic, args) {
              if (topics.hasOwnProperty(topic)) {
                      topic = topics[topic];
                      args = args || [];
                  var len = topic.length;
  
                  while (len--) {
                      topic[len].apply($, args);
                  }
              }
              return $;
          };
  
          // Returns handle needed for ignore function
          $.listen = function(topic, callback) {
              if (!topics.hasOwnProperty(topic)) {
                  topics[topic] = [];
              }
              topics[topic].push(callback);
  
              return $;
          };
  
          // Removes listener from event its handle was assigned to
          $.ignore = function(topic, callback) {
              if (topics.hasOwnProperty(topic)) {
                      topic = topics[topic];
                  var len = topic.length;
  
                  while (len--) {
                      if (topic[len] === callback) {
                          topic.splice(len-1, 1);
                          // break; here? duplicate handles are possible
                      }
                  }
              }
              return $;
          };
      }
  }());
  var EventsManager3 = {}
  Manager3(EventsManager3);
  
  var jqTest = {},
      cogTest = {},
      ee = new EventEmitter(),
      ee2 = new EventEmitter2(),
      beanTest = {};
  
  function test() {return 1+1}
  
  

