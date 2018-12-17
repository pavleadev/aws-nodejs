const aws = require('aws-sdk');

var awsUtils = {};
aws.config = {
  accessKeyId: process.env.AwsAccessKey,
  secretAccessKey: process.env.AwsSecretAccessKey,
  region: process.env.AwsRegion,
  signatureVersion: 'v4',
};

const s3 = new aws.S3();
const sns = new aws.SNS({
  region: process.env.AwsRegion,
});

awsUtils.s3Putimage = (file, key, encoding) => {
  return new Promise((resolve, reject) => {
    const params = {
      Body: file.body,
      Bucket: process.env.AwsS3Bucket,
      Key: key,
    };

    s3.putObject(params, (err, data) => {
      (err) ? reject(err) : resolve(key);
    });
  });
}

awsUtils.s3Getimage = (key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AwsS3Bucket,
      Key: key,
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

awsUtils.publishSnsSMS = (to, message) => {
  return new Promise((resolve, reject) => {
    const params = {
      Message: message,
      MessageStructure: 'string',
      PhoneNumber: to,
    };
    const attri = {
      attributes: { /* required */
        DefaultSMSType: 'Transactional', /* highest reliability */
      },
    }
    sns.setSMSAttributes(attri, (err,res) => {
      if (res) {
        sns.publish(params, (snsErr, snsData) => {
           (snsErr) ? reject(snsErr) : resolve(snsData);
        });
      }
      else if (err) {
        reject(err);
      }
    })
  })
};

module.exports = awsUtils;