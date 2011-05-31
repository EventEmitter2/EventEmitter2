
this.basicEvents = {
  '1. Testname': function (test) {

    var tests = {
     'foo:*': 4,
     'foo:*:bar': 2,
     'foo:*:*': 3,
     'foo:bar:bar': 2
    }

    Object.keys(tests).forEach(function (event) {
      var vat = new EventEmitter(),
          count = 0;

      vat.on(event, function () {
        eyes.inspect(arguments, event);
        count++;
      });

      eyes.inspect(event, 'Beginning test for');

      vat.emit('foo/box/bar', 1, 2, 3, 4);
      vat.emit('foo/bar/*', 5, 6, 7, 8);
      vat.emit('foo/*/*', 9, 10, 11, 12);
      vat.emit('foo/*');

      assert.equal(count, tests[event]);
    });


    test.ok(true, 'everythings ok');
    test.done();

  },
  '2. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },  
  '3. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  '4. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  
  '5. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  '6. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  '7. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },    
  '8. ': function (test) {

    test.ok(true, 'everythings ok');
    test.done();

  },
  
  
  '9. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '10. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '11. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '12. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '13. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  
  '14. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  },
  '15. ': function (test) {
    
    test.ok(true, 'everythings ok');
    test.done(); 
    
  }    
  

};
