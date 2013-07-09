'use strict';

var should = require('should');

/**
 * Add the BaseEngine engine to resourceful:
 */

var resourceful = require('resourceful');

require('..').init(resourceful);

describe('No Methods', function(){
  var BaseEngine
    , id = '06675651';

  before(function(done){

    /**
     * Create a class that's connected to the BaseEngine:
     */

    BaseEngine = resourceful.define('dummy', function (){
      this.use('BaseEngine', { 'uri': 'dummy' });
      done();
    });
  });

  it('should be no del method', function(done){
    BaseEngine.destroy(id, function(err, company){
      should.exist(err);
      err.should.have.property('message', 'No delete method.');
      should.not.exist(company);
      done();
    });
  });

  it('should be no get method', function(done){
    BaseEngine.get(id, function(err, company){
      should.exist(err);
      err.should.have.property('message', 'No get method.');
      should.not.exist(company);
      done();
    });
  });

  it('should be no put method', function(done){
    BaseEngine.create({}, function(err, company){
      should.exist(err);
      err.should.have.property('message', 'No put method.');
      should.not.exist(company);
      done();
    });
  });
});
