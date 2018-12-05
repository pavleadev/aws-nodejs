var userUtil = require('./userUtils');
var userController = {};
var userData;

userController.addDetail = (req, res) => {
  const { userEmail, userPassword, userpicture } = req.body;
  userData = { 
    userEmail: userEmail, 
    userPassword: userPassword,
  };
  userpicture ? userData.userpicture = userpicture : null;

  userUtil.createUser(userData).then((data) => {
    console.log(data);
    res.status(200).json({body : "You're successfull.", data: data});
  }).catch((err) => {
    console.log(err);
    res.status(400).json({error: "sorry, error in operation."})
  })
 
}

userController.getDetail = (req, res) => {
  console.log("request is", req.query.id);
  const userId = req.query.id;
  
  userUtil.getUser(userId).then((data) => {
    res.status(200).json({ body: data });
  }).catch((err) => {
    console.log("error is", err);
    res.status(400).json({error: "sorry, error in operation."})
  })
  // res.status(200).json({ body: userData });
}

module.exports = userController;