const bcrypt = require('bcryptjs')
const { nanoid } = require('nanoid')
const { getUserDb, createUserDb } = require('../db/user.db')
const apiResponse = require('../utils/apiResponse')
const APIStatus = require('../constants/APIStatus')
const genToken = require('../utils/genToken')
const hashPassword = require('../utils/hashPassword')
const globalCache = require('../db/globalCache')
const sendEmail = require('../utils/sendEmail')
const { port } = require('../../configs')

const login = async (req, res, next) => {
  const { username, password } = req.body
  const user = await getUserDb({ username })
  if (!user) {
    return res.status(400).json(
      apiResponse({
        status: APIStatus.FAIL,
        msg: 'Username or password wrong'
      })
    )
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = genToken(user)
      const { password, _id, ...info } = user._doc
      return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: { token, role: user.role } }))
    }
    if (err) {
      return res.status(500).json(apiResponse({ status: APIStatus.ERROR, msg: 'Internal Server Error' }))
    }
    return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'Username or password wrong' }))
  })
}

const signup = async (req, res, next) => {
  const { email, username, password } = req.body
  const [user1, user2] = await Promise.all([getUserDb({ email }), getUserDb({ username })])
  if (user1 || user2) { return res.status(409).json(apiResponse({ status: APIStatus.FAIL, msg: 'email or username existed' })) }

  const hashedPw = await hashPassword(password)
  const user = await createUserDb({ email, username, password: hashedPw })
  if (!user) return res.status(400).json(apiResponse({ status: APIStatus.ERROR, msg: 'can not create new user' }))

  const token = genToken(user)
  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: { token } }))
}

const forgetPasswordUser = async (req, res, next) => {
  const { email } = req.body
  const user = await getUserDb({ email })
  if (!user) return res.status(404).json(apiResponse({ status: APIStatus.FAIL, msg: 'This account does not exist' }))

  const verifyCode = nanoid()
  const verifyLink = `http://localhost:${port}/auth/user/verify-code?email=${email}&code=${verifyCode}`
  globalCache.set(`user:${email}`, verifyCode, '10h')
  await sendEmail(email, 'Forget password on Pet Feeder', 'Click this link to verify', verifyLink)

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'Check your email to get the verify link' }))
}

const verifyCodeUser = async (req, res, next) => {
  const { email, code } = req.query

  const realCode = globalCache.get(`user:${email}`)
  if (realCode !== code) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'Invalid code' }))

  const newPassword = nanoid(8)
  const [user, hashedPw] = await Promise.all([getUserDb({ email }), hashPassword(newPassword)])

  user.password = hashedPw
  await Promise.all([user.save(), sendEmail(email, 'New password on Pet Feeder', 'This is your new password', newPassword)])
  globalCache.del(`user:${email}`)

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'Check your email to get your new password' }))
}

module.exports = {
  login, signup, forgetPasswordUser, verifyCodeUser
}
