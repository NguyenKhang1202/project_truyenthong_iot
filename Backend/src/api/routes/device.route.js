const express = require('express')
const { validate } = require('express-validation')
const { getAllUserDevices, getDevice, createDevice, deleteDevice } = require('../controllers/device.controller')
const { authUser } = require('../middlewares/auth.middleware')
const asyncWrap = require('../utils/asyncWrap')
const { createDeviceValidation } = require('../validations/device.validation')

const router = express.Router()

router.post('/', validate(createDeviceValidation), authUser, asyncWrap(createDevice))
router.delete('/:id', authUser, asyncWrap(deleteDevice))
router.get('/:id', authUser, asyncWrap(getDevice))
router.get('/', authUser, asyncWrap(getAllUserDevices))

module.exports = router
