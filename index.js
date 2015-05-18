var path = require('path');

var validate = require('lambduh-validate');
var execute = require('lambduh-execute');
var upload = require('lambduh-put-s3-object');
var downloadFile = require('lambduh-download-file');

exports.handler = function(event, context) {

  //validate that required event.fields are present
  validate(event, {
    "srcUrl": true,//Validate that this is a url?
    "destBucket": true,
    "destKey": true
  })

  .then(function() {
    //download file to /tmp
    return downloadFile({
      filepath: "/tmp/" + event.destKey,
      url: event.srcUrl
    });
  })

  .then(function() {
    //execute shell/bash to scale to desired res
    return execute({
      shell: "cp /tmp/" + event.destKey + " /tmp/copied" + path.extname(event.destKey),
      logOutput: true
    });
  })

  .then(function() {
    //upload scaled version
    return upload(event, {
      dstBucket: event.destBucket,
      dstKey: event.destKey,
      uploadFilepath: '/tmp/copied" + path.extname(event.destKey)'
    });
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
