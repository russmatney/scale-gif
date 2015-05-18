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
    //set some 'constants'
    event.extension = path.extname(event.destKey);
    event.downloadedFile = "/tmp/downloadedFile" + event.extension;
    event.filepathForUpload = "/tmp/copied" + event.extension;

    //download file to /tmp
    return downloadFile({
      filepath: event.downloadedFile,
      url: event.srcUrl
    });
  })

  .then(function() {
    //execute shell/bash to scale to desired res
    console.log('copying');
    var shellString = "cp " + event.downloadedFile + " " + event.filepathForUpload + ";";
    return execute(event, {
      shell: shellString
    });
  })

  .then(function() {
    //upload scaled version
    return upload(event, {
      dstBucket: event.destBucket,
      dstKey: event.destKey,
      uploadFilepath: event.filepathForUpload
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
