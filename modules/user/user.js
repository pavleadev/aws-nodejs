const exp = require('express');
const userController = require('./userController.js');
const userRouter = exp.Router();

userRouter.post('/addDetails', userController.addDetail);
userRouter.get('/getDetail', userController.getDetail)

module.exports = userRouter;