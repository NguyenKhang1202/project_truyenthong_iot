const express = require('express')

const User = require('../models/user.model')
const { authAdmin } = require('../middlewares/auth.middleware')
const { getStatistic } = require('../controllers/admin.controller')
const asyncWrap = require('../utils/asyncWrap')
const hashPassword = require('../utils/hashPassword')

const createAdmin = async (req, res, next) => {
  const { username, email, password } = req.body
  const hashedPassword = await hashPassword(password)
  await new User({ username, email, password: hashedPassword, role: 'admin' }).save()
  return res.status(200).json({ msg: 'create admin successfully' })
}

const router = express.Router()

router.get('/', authAdmin, asyncWrap(getStatistic))

router.post('/test/createAdmin', asyncWrap(createAdmin))

module.exports = router
