const jwt = require('jsonwebtoken')
const { jwtKey } = require('../../configs')

const genToken = (user) => {
  const token = jwt.sign({ _id: user._id.toString(), role: user.role, username: user.username, email: user.email, phone: user.phone, gender: user.gender, address: user.address, avatar: user.avatar, fullName: user.fullName }, jwtKey, {
    expiresIn: '10h'
  })

  return token
}

module.exports = genToken
