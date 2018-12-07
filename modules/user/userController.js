var userUtil = require('./userUtils');
var passwordHash = require('password-hash');
var userController = {};
var userData;

userController.addDetail = (req, res) => {
  const { userEmail, userPassword, userpicture, userName, userGender, seasons } = req.body;
  userData = {
    userEmail: userEmail,
    userPassword: passwordHash.generate(userPassword),
    userName: userName,
    userGender: userGender,
    seasons: seasons,
  };
  userpicture ? userData.userpicture = userpicture : null;

  userUtil.createUser(userData).then((data) => {
    res.status(200).json({ body: "You're successfull.", data: data });
  }).catch(() => {
    res.status(400).json({ error: "sorry, error in operation." })
  })

}

userController.getDetail = (req, res) => {
  const userId = req.query.id;

  userUtil.getUser(userId).then((data) => {
    res.status(200).json({ body: data });
  }).catch(() => {
    res.status(400).json({ error: "sorry, error in operation." })
  })
}

userController.varifyUser = (req, res) => {

  const { userEmail, userPassword } = req.body;
  const userData = {
    userEmail: userEmail,
    userPassword: userPassword
  }

  userUtil.varifyUser(userData).then((data) => {
    (passwordHash.verify(userData.userPassword, data.userPassword)) ? res.status(200).json({ body: data }) : res.status(400).json({ error: "Sorry, you entered wrong password." })
  }).catch((err) => {
    res.status(400).json({ error: "Sorry, error in operation." })
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
    res.status(200).json({ body: resp });
  }).catch(() => {
    res.status(400).json({ error: "sorry, error in operation." })
  })
}

module.exports = userController;