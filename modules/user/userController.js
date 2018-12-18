var userUtil = require('./userUtils');
var passwordHash = require('password-hash');
const l10n = require('jm-ez-l10n');
var userController = {};
const _ = require('lodash');
var userData;

userController.addDetail = (req, res) => {
  const { userEmail, userPassword, userpicture, userName, userGender, seasons, userMobile } = req.body;
  userData = {
    userEmail: userEmail,
    userPassword: passwordHash.generate(userPassword),
    userName: userName,
    userGender: userGender,
    seasons: seasons,
    userMobile: userMobile
  };
  userpicture ? userData.userpicture = userpicture : null;

  userUtil.createUser(userData).then((data) => {
    res.status(200).json({ body: l10n.t("REGISTARTION_SUCESS"), data: data });
  }).catch(() => {
    res.status(400).json({ error: l10n.t("ERR_REGISTRATION") })
  })

}

userController.getDetail = (req, res) => {
  const userId = req.query.id;

  userUtil.getUser(userId).then((data) => {
    res.status(200).json({ body: data });
  }).catch(() => {
    res.status(400).json({ error: l10n.t('ERR_OPERATION') });
  })
}

userController.varifyUser = (req, res) => {

  const { userEmail, userPassword } = req.body;
  const userData = {
    userEmail: userEmail,
    userPassword: userPassword
  }

  userUtil.varifyUser(userData).then((data) => {
    (passwordHash.verify(userData.userPassword, data.userPassword)) ? res.status(200).json({ body: l10n.t("LOGIN_SUCCESS"), data: data }) : res.status(400).json({ error: l10n.t("ERR_PASSWORD_VARIFICATION") })
  }).catch((err) => {
    res.status(400).json({ error: err})
  })
}

userController.editUserDetail = (req, res) => {
  const { seasons, userGender, userName, userpicture } = req.body;
  let userData = {
    seasons: seasons,
    userGender: userGender,
    userName: userName,
  }
  userpicture ? userData.userpicture = userpicture : null;
  userUtil.editUser(req.body.id, userData).then((resp) => {
    res.status(200).json({ body: l10n.t("EDIT_SUCCESS"), data: resp });
  }).catch(() => {
    res.status(400).json({ error: l10n.t('ERR_OPERATION') })
  })
}

userController.checkUserExist = (req, res) => {
  userUtil.checkUserExist(req.body.email).then((data) => {
    if (!_.isEmpty(data)) {
      res.status(200).json({ isexist: true });
    } else {
      res.status(200).json({ isexist: false });
    }
  }).catch((err) => {
    res.status(400).json({ error: l10n.t('ERR_OPERATION') })
  })
}

userController.forgotPasswordHandler = (req, res) => {
  const { userEmail, userMobile } = req.body;
  if (userEmail) {
    userUtil.forgotPasswordUSerEmail(userEmail).then((data) => {
      res.status(200).json({ body: l10n.t("FORGOT_PSWD_SUCCESS_EMAIL"), data: data });
    }).catch((err) => {
      res.status(400).json({ error: l10n.t('ERR_OPERATION') })
    });
  }
  else if (userMobile) {
    userUtil.forgotPasswordUSerMobile(userMobile).then((data) => {
      res.status(200).json({ body: l10n.t("FORGOT_PSWD_SUCCESS_SMS"), data: data })
    }).catch((err) => {
      res.status(400).json({ error: l10n.t('ERR_OPERATION') })
    });
  }
}

module.exports = userController;