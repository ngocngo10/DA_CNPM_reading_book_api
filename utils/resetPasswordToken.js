const jwt = require('jsonwebtoken');

const resetPasswordToken = function(id){
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '20m',
  })
}

module.exports = {resetPasswordToken};