const jwt = require('jsonwebtoken')
const { jwtKey } = require('../../configs')
const APIStatus = require('../constants/APIStatus')
const { getUserDb } = require('../db/user.db')
const apiResponse = require('../utils/apiResponse')

const authUser = async (req, res, next) => {
  const token = getHeaderToken(req)
  if (!token) return res.status(401).json(apiResponse({ status: APIStatus.FAIL, msg: 'You are not authorized' }))

  try {
    const decode = jwt.verify(token, jwtKey)
    const user = await getUserDb({ _id: decode._id })
    if (!user) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'Invalid token' }))

    req.user = user
    next()
  } catch (err) {
    console.log(err)
    return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'Invalid token' }))
  }
}

const authAdmin = async (req, res, next) => {
  const token = getHeaderToken(req)
  if (!token) return res.status(401).json(apiResponse({ status: APIStatus.FAIL, msg: 'You are not authorized' }))

  try {
    const decode = jwt.verify(token, jwtKey)
    const user = await getUserDb({ _id: decode._id })
    if (!user) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'Invalid token' }))

    if (user.role !== 'admin') return res.status(403).json(apiResponse({ status: APIStatus.FAIL, msg: 'You need admin rights to use this api' }))
    req.user = user
    next()
  } catch (err) {
    console.log(err)
    return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'Invalid token' }))
  }
}

const getHeaderToken = (req) => {
  const originalToken = req.header('Authorization') || req.header('x-access-token')
  if (!originalToken) return null

  const token = originalToken.replace('Bearer ', '')
  return token
}

module.exports = {
  authUser,
  authAdmin
}
