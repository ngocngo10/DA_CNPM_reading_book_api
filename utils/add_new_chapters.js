const express = require('express');
const router = express.Router();
require('dotenv').config;
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-1';

async function getNewChapterUrl(content) {
  const s3 = new aws.S3();
  const fileName = new Date().valueOf() + '.txt';
  const fileType = 'text/plain'
  const bucketName = 'chapters';
  const s3Params = {
    Bucket: S3_BUCKET + '/' + bucketName,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  const data = await s3.putObject({
    ...s3Params,
    // ContentType: 'binary',
    Body: Buffer.from(content, 'binary')
  }).promise();

  const url = `https://${S3_BUCKET}.s3.amazonaws.com/${bucketName}/${fileName}`
   
  return url;
}

module.exports = { getNewChapterUrl };
