const jwt = require('jsonwebtoken');

const generateToken = function(id){
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '60m',
  })
}

const generateRefreshToken = function(id){
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '10d',
  })
}

module.exports = { generateToken, generateRefreshToken };