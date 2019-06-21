const userSchema =  require('./userSchema');
var jwtUtil = require('../../helper/jwt')
const userMiddleware = {};

userMiddleware.verifyJWTToken = (req,res, next) => {
  const {
    headers
  } = req;

  if(headers.authorizationtoken){
    const decoded = jwtUtil.decodeAuthToken(headers.authorizationtoken.replace('Bearer ', ''));
    if(decoded) {
      const { id } = decoded;
      userSchema.findById(id).then(data => {
        if(data){
          next();
        } else {
          res.status(400).json({ error: 'You are not authorized.' })
        }
      })
    } else {
      res.status(400).json({ error: 'You are not authorized.' })
    }
  } else {
    res.status(400).json({ error: 'You are not authorized.' })
  }
}

module.exports = userMiddleware;