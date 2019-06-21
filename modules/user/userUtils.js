var userSchema = require('./userSchema');
var dummyUserSchema = require('./userDummySchema');
var awsUtils = require('../../helper/aws');
var sendEmail = require('../../helper/sendEmail');
var passwordHash = require('password-hash');
const l10n = require('jm-ez-l10n');
var userUtil = {};

userUtil.createUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.userpicture) {
      uploadImage(userData.userpicture, userData.userEmail).then((res) => {
        userData.userpicture = res;
        userSchema.create(userData).then((res) => resolve(res)).catch((err) => reject(err));
      }).catch(() => {
        reject("Sorry, some error in upload image");
      })
    } else {
      userSchema.create(userData).then((res) => resolve(res)).catch((err) => reject(err));
    }
  })
}

uploadImage = (image, userEmail) => {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const ext = image.split(';')[0].split('/')[1] || 'jpg';
    // const key = `${uuid.v1()}.${ext}`;
    const key = userEmail + Date.now();
    awsUtils.s3Putimage({ body, mime: `image/${ext}` }, key, 'base64').then((result) => { resolve(result); }).catch((err) => { reject(err); });
  })
}

userUtil.getUser = (userId) => {
  return new Promise((resolve, reject) => {
    userSchema.findById(userId).then((res) => {
      if (res.userpicture) {
        awsUtils.s3Getimage(res.userpicture).then((response) => {
          res.userpicture = response;
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      }
      else {
        resolve(res);
      }
    }).catch((err) => {
      reject(err);
    })
  })
}

userUtil.getUserfromDB = (userId) => {
  return new Promise((resolve, reject) => {
    userSchema.findById(userId).then((res) => { resolve(res); }).catch((err) => { reject(err); })
  })
}

userUtil.varifyUser = (data) => {
  return new Promise((resolve, reject) => {
    userSchema.findOne({ userEmail: data.userEmail }).then((res) => {
      (res) ? resolve(res) : reject(l10n.t("ERR_LOGIN"));
    }).catch((err) => {
      reject(err);
    })
  })
}

userUtil.editUser = (id, data) => {
  return new Promise((resolve, reject) => {
    if (data.userpicture) {
      userUtil.getUserfromDB(id).then((user) => {
        const body = Buffer.from((data.userpicture).replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const ext = (data.userpicture).split(';')[0].split('/')[1] || 'jpg';
        // const key = `${uuid.v1()}.${ext}`;
        let key;
        if (user.userpicture) {
          key = user.userpicture
        } else {
          key = user.userEmail + Date.now();
        }
        awsUtils.s3Putimage({ body, mime: `image/${ext}` }, key, 'base64').then((result) => {
          resolve(result);
          (user.userpicture) ? delete data.userpicture : data.userpicture = result;
          userSchema.findOneAndUpdate({ _id: id }, { $set: data }, { new: true }).then((resp) => { resolve(resp) }).catch((err) => { reject(err) })
        }).catch((err) => {
          reject(err);
        });
      })
    }
    else {
      userSchema.findOneAndUpdate({ _id: id }, { $set: data }, { new: true }).then((resp) => { resolve(resp) }).catch((err) => { reject(err) })
    }
  })
}

userUtil.checkUserExist = (email) => {
  return new Promise((resolve, reject) => {
    userSchema.findOne({ userEmail: email }).then((data) => {
      (data != null) ? resolve(data) : resolve({});
    }).catch((err) => {
      reject(err);
    })
  })
}

userUtil.forgotPasswordUSerEmail = (email) => {
  return new Promise((resolve, reject) => {
    userSchema.findOne({ userEmail: email }).then(() => {
      let newPassword = 'Abcd1234';
      sendEmail.sendEmailToUser(email, newPassword).then((res) => {
        let userPassword = passwordHash.generate(res.newPassword);
        userSchema.findOneAndUpdate({ userEmail: email }, { userPassword: userPassword }).then((data) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    }).catch((err) => {
      reject(err);
    })
  })
}

userUtil.forgotPasswordUSerMobile = (mobile) => {
  return new Promise((resolve, reject) => {
    userSchema.findOne({ userMobile: mobile }).then((data) => {
      let msg = `Your password is ${data.userPassword}`;
      awsUtils.publishSnsSMS(mobile, msg).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      })
    }).catch((err) => {
      reject(err);
    })
  })
}

userUtil.dummyUserStructure = (page) => {
  return new Promise((resolve,reject) => {
    let total_pages = 10;
    let per_page = 15;
    // "page":1,"per_page":3,"total":12,"total_pages":4,
    dummyUserSchema.find().limit(per_page).skip(total_pages - page).then((data) => {
      resolve({
        paginate: {
          total_pages: total_pages,
          per_page: per_page,
          page: page,
          total: 150
        },
        data: data
      });
    }).catch((err) => {
      reject(err);
    })
  })
}

userUtil.uploadImageTest = (image) => {
  return new Promise((resolve, reject) => {
    // const body = Buffer.from((imageData.path), 'base64');
    // const ext = image.name.split(';')[0].split('/')[1] || 'jpg';
    //awsUtils.putObject(image, key, 'base64').then((result) => { resolve(result); }).catch((err) => { reject(err); });

    awsUtils.s3Putfile(image.file , 'Test_ticket', "base64" ).then((result) => { resolve(result); }).catch((err) => { reject(err); });
  })
}

userUtil.testSocketIO = (io, data) => {
  io.emit('SocketFromNode', data);
}

module.exports = userUtil;