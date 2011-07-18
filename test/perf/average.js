
var util = require('util'),
    exec = require('child_process').exec,
    colors = require('colors'),
    async = require('async');

var args = process.argv.splice(2);
var tests = {};
var iterations = 2;
var cpos = 0;
var c = ['/', '-', '\\', '|'];

  process.on('SIGINT', function () {

    var tmp;
    
    Object.keys(tests).forEach(function(key) {
      var t = parseInt(tests[key].time, 10);
      if(!tmp) { tmp = t; }
      var msg = key + ': ' + parseInt(tests[key].time, 10);
      if(tmp > t) {
        console.log(msg.green, '(-'.green + (tmp-t).toString().green + ')'.green);
      }
      else {
        console.log(msg, '(+' + (t-tmp) + ')');
      }
      
    });

    process.exit();
  });

  args.forEach(function(key) {
    tests[key] = { time: 0 }
  })

  var count = 0;

  async.whilst(
    function () { return count < 100; },
    function (wcallback) {
      
      count++;
      var children = [];
      
      async.forEach(  
        args,
        function(arg, callback){

          exec('node ' + arg,
            function (error, stdout, stderr) {
              children.push([arg, stdout.replace('test:', '').replace('ms', '').trim()]);
              callback();
          });

        }, 
        function(err){
          
          children.forEach(function(a) {
            tests[a[0]].time += parseInt(a[1], 10);
          });
          
          if(cpos === c.length) { cpos = 0; }
          process.stdout.write('Testing... ' + c[cpos++] + '\r');
          wcallback();
        }
      );
        
    },
    function (err) {
      
      var tmp;
      
      Object.keys(tests).forEach(function(key) {
        var t = parseInt(tests[key].time, 10);
        if(!tmp) { tmp = t; }
        var msg = key + ': ' + parseInt(tests[key].time, 10);
        if(tmp < t) {
          console.log(msg.green, '-'+tmp-t)
        }
        else {
          console.log(msg)
        }

      });
      
    }
  );
  
