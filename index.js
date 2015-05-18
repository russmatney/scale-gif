
var validate = require('lambduh-validate');
var execute = require('lambduh-execute');
var upload = require('lambduh-put-s3-object');
var downloadFile = require('lambduh-download-file');

exports.handler = function(event, context) {

  //validate that required event.fields are present
  validate(event, {
    "srcUrl": true,
    "destBucket": true,
    "destKey": true
  })

  .then(function() {
    //download file to /tmp
  })

  .then(function() {
    //execute shell/bash to scale to desired res
  })

  .then(function() {
    //upload scaled version
  })

  .then(function() {
    context.done();
  })
  .fail(function(err) {
    if(err) {
      context.done(err);
    } else {
      context.done(new Error("Unspecifed fail."));
    }
  });
};
