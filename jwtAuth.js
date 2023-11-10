const { sign, verify } = require('jsonwebtoken');
require('dotenv').config();

// sign jwt.
const createToken = (userDetails) => {

  const accessToken = sign(
    { fullName: userDetails.fullName, 
      id: userDetails._id, 
      email: userDetails.email, 
      role: userDetails.role, 
    },
    process.env.SECRETE
  );

  return accessToken;

};

// verify jwt.
const validateToken = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader){
       return  res.status(401).send("No Authorization Header")
    }
    const val = authorizationHeader.split(" ");
    const tokenType = val[0];
    const tokenValue = val[1];
    if(tokenType ==='Bearer'){
        const decoded = verify(tokenValue, process.env.SECRETE );
        req.userDetails = decoded;
        next();
        return;
    }
    res.status(401).json({ message: 'User not authorized' });
    
  } catch (error) {
   res.status(500).json({ message: error.message });
  }

};

//for customers only .
const customersOnly = (req, res, next) => {
    if(req.userDetails.role === 'customer'){
      next();
    }else{
     return res.status(403).json({message: 'action-not-allowed, only for customers'});
    }
};

//for riders only .
const ridersOnly = (req, res, next) => {
    if(req.userDetails.role === 'rider'){
      next();
    }else{
     return res.status(403).json({message: 'action-not-allowed, only for riders'});
    }
  };


module.exports = { createToken, validateToken, customersOnly, ridersOnly };
