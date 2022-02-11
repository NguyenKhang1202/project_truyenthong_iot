const express = require('express')
const { validate } = require('express-validation')
const asyncWrap = require('../utils/asyncWrap')
const { login, signup, forgetPasswordUser, verifyCodeUser } = require('../controllers/auth.controller')
const { loginValidation, signupValidation, forgetPasswordValidation } = require('../validations/auth.validation')

const router = express.Router()

router.post('/user/login', validate(loginValidation), asyncWrap(login))
router.post('/user/signup', validate(signupValidation), asyncWrap(signup))
router.post('/user/forget-password', validate(forgetPasswordValidation), asyncWrap(forgetPasswordUser))

router.get('/user/verify-code', asyncWrap(verifyCodeUser))

module.exports = router
