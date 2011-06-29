exports.Manager = (function(undefined) {
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