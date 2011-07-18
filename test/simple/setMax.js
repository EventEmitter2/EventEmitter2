/*
 * setMax.js
 * Tests setMaxListener functionality of EventEmitter2
 *
 * (C) 2011, Nodejitsu Inc.
 *
 */

var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    spawn = require('child_process').spawn,
    vows = require('vows'),
    eyes = require('eyes'),
    EventEmitter = require('../../lib/em2').EventEmitter2;

//var .onAny(function () {return;console.error(eyes.inspect(arguments))});
//    .onAny(function () {return;console.error(eyes.inspect(arguments))});

vows.describe('EventEmitter2/setMaxListeners').addBatch({

  "When using an instance of cerebrum.Instrument": {
    topic: function () {
      var that = this;
    },
    "adding more than 10 should do a print-trace" :  function () {
    }
  }
}).export(module);

