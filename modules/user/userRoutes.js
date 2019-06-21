const exp = require('express');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const userController = require('./userController.js');
const userMiddleware =require('./userMiddleware');
const userRouter = exp.Router();
userRouter.use(multipartMiddleware);

userRouter.post('/addDetails', userController.addDetail);
userRouter.get('/getDetail', userMiddleware.verifyJWTToken ,userController.getDetail);
userRouter.post('/loginUser', userController.varifyUser);
userRouter.post('/editUserDetail', userController.editUserDetail);
userRouter.post('/checkUserExist', userController.checkUserExist);
userRouter.post('/forgotPassword', userController.forgotPasswordHandler);
userRouter.get('/getDummyUsers', userController.dummyUserData);
userRouter.post('/testImage', multipartMiddleware, userController.testImageController);

module.exports = userRouter;