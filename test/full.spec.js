var index = require('../');
var expect = require('chai').expect;

describe('scale-gif', function() {
  it('should exist', function() {
    expect(index).to.exist;
  });

  it('should have a handler', function() {
    expect(index.handler).to.be.a('function');
  });

  it('should call .done(err) when things fail', function(done) {
    var badEventData = {};
    var context = {
      done: function(err, message) {
        if (err || message) {
          done();
        } else {
          done(new Error('expected error message'));
        }
      }
    };
    index.handler(badEventData, context);
  });

  it('should call .done() when things go well', function(done) {
    var event = {};
    var context = {
      done: function(err, message) {
        if (err || message) {
          done(err || message);
        } else {
          done();
        }
      }
    };
    index.handler(event, context);
  });

});

