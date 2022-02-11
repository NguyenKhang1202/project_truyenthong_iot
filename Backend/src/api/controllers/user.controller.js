const bcrypt = require('bcryptjs/dist/bcrypt')
const APIStatus = require('../constants/APIStatus')
const { updateUserPwDb, updateUserDb } = require('../db/user.db')
const hashPassword = require('../utils/hashPassword')
const apiResponse = require('../utils/apiResponse')

const updateInfo = async (req, res, next) => {
  const user = req.user
  const { gender, fullName, address } = req.body

  const userr = updateUserDb({ userId: user._id, newInfo })

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'update user successfully' }))
}

const getInfo = async (req, res, next) => {
  const user = req.user
  const { password, _id, ...info } = user._doc

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: { info } }))
}

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  const user = req.user

  bcrypt.compare(oldPassword, user.password, async (err, result) => {
    if (result) {
      const hashedPw = await hashPassword(newPassword)
      const rs = await updateUserPwDb({ userId: user._id, password: hashedPw })

      return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: { rs } }))
    }
    if (err) {
      return res.status(500).json(apiResponse({ status: APIStatus.ERROR, msg: 'Internal Server Error' }))
    }
    return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'Old password is wrong' }))
  })
}

module.exports = {
  updateInfo,
  getInfo,
  changePassword
}
