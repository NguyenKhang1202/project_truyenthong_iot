const express = require('express')
const { validate } = require('express-validation')
const { changePassword, getInfo, updateInfo } = require('../controllers/user.controller')
const { authUser } = require('../middlewares/auth.middleware')
const asyncWrap = require('../utils/asyncWrap')
const { changePasswordValidation, updateInfoValidation } = require('../validations/user.validation')

const router = express.Router()

router.post('/change-password', validate(changePasswordValidation), authUser, asyncWrap(changePassword))
router.post('/info', validate(updateInfoValidation), authUser, asyncWrap(updateInfo))
router.get('/info', authUser, asyncWrap(getInfo))

module.exports = router
