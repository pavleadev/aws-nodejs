const exp = require('express');
const userController = require('./userController.js');
const userRouter = exp.Router();

userRouter.post('/addDetails', userController.addDetail);
userRouter.get('/getDetail', userController.getDetail);
userRouter.post('/loginUser', userController.varifyUser);
userRouter.post('/editUserDetail', userController.editUserDetail);
userRouter.post('/checkUserExist', userController.checkUserExist)
module.exports = userRouter;