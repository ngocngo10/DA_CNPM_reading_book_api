const jwt = require('jsonwebtoken');

const generateToken = function(id){
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 30*60,
  })
}

const generateRefreshToken = function(id){
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '10d',
  })
}

module.exports = { generateToken, generateRefreshToken };