var userSchema = require('./userSchema');
var awsUtils = require('../../helper/aws');
var userUtil = {};

userUtil.createUser = (userData) => {
  return new Promise((resolve,reject) => {
    if (userData.userpicture) {
      uploadImage(userData.userpicture).then((res) => {
        console.log("res is", res);
        userData.userpicture = res;
        userSchema.create(userData, (err, res) => {
          if (err) {
            // console.log("error in data inseration.", err);
             reject(err);
          }
          if (res) {
            // console.log("data inserted.", res);
            resolve(res);
          }
        })
      }).catch((err) => {
        console.log("error in upload image");
      })
    } else {
      userSchema.create(userData, (err, res) => {
        if (err) {
          // console.log("error in data inseration.", err);
          reject(err);
        }
        else if (res) {
          // console.log("data inserted.", res);
          resolve(res);
        }
      })
    }
  })
}

uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const ext = image.split(';')[0].split('/')[1] || 'jpg';
    // const key = `${uuid.v1()}.${ext}`;
    const key = `ABCD`;
    awsUtils.s3Putimage({ body, mime: `image/${ext}` }, key, 'base64').then((result) => {
        console.log("Result is", result);
        resolve(result);
        // userToUpdate.profilePic = result.url;
        // userToUpdate.save();
      })
      .catch((err) => {
        logger.error(err);
        reject(err);
      });
  })
}

userUtil.getUser = (userId) => {
  return new Promise((resolve, reject) => {
    userSchema.findById(userId).then((res) => {
     if(res.userpicture){
      awsUtils.s3Getimage(res.userpicture).then((response) => {
        console.log("user picture is", response);
        res.userpicture = response;
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
     }
     else{
       resolve(res);
     }
    }).catch((err) => {
      reject(err);
    })
  })
}

module.exports = userUtil;