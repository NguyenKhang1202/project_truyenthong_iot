const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 10)

  return hashed
}

module.exports = hashPassword
