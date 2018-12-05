const aws = require('aws-sdk');

var awsUtils = {};
aws.config = {
  accessKeyId: process.env.AwsAccessKey,
  secretAccessKey: process.env.AwsSecretAccessKey,
  // region: process.env.AwsRegion,
  signatureVersion: 'v4',
};

const s3 = new aws.S3();

awsUtils.s3Putimage = (file, key, encoding) => {
  return new Promise((resolve, reject) => {
    // fs.readFile(file.path, (error, fileContent) => {
    // if unable to read file contents, throw exception
    // if (error) { throw error; }
    const params = {
      Body: file.body,
      Bucket: process.env.AwsS3Bucket,
      Key: key,
      // ACL: 'public-read',
      // ContentType: file.mime,
      // ContentDisposition: 'inline',
      // ContentEncoding: encoding,
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(key);
        // resolve({
        //   key, url: awsUtils.getCFUrl(key),
        // });
      }
    });
  });
}

awsUtils.s3Getimage = (key) => {
  return new Promise((resolve, reject) => {
    // fs.readFile(file.path, (error, fileContent) => {
    // if unable to read file contents, throw exception
    // if (error) { throw error; }
    const params = {
      // Body: file.body,
      Bucket: process.env.AwsS3Bucket,
      Key: key,
      // ACL: 'public-read',
      // ContentType: file.mime,
      // ContentDisposition: 'inline',
      // ContentEncoding: encoding,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        let image = 'data:image/jpeg;base64,' + data.Body.toString('base64');
        resolve(image);
      }
    });
  });
}

awsUtils.getS3Url = (key) => {
  return `https://${process.env.AwsS3Bucket}.s3.amazonaws.com/${key}`;
};

module.exports = awsUtils;