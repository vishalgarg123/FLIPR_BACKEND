const jwt=require('jsonwebtoken')
const userModel=require("../models/user-model")

//check user is authorized or not

module.exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
