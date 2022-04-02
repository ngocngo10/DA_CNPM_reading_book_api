const express = require('express');
const router = express.Router();
require('dotenv').config;
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-1';

router.get('/sign-s3', function (req, res) {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET + '/book-covers',
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest : data,
      url : `https://${S3_BUCKET}.s3.amazonaws.com/book-covers/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  })
})

module.exports = router;
