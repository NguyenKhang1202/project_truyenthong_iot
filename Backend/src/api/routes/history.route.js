const express = require('express')
const { getAllUserHistory, getAllDeviceHistory } = require('../controllers/history.controller')
const { authUser } = require('../middlewares/auth.middleware')
const asyncWrap = require('../utils/asyncWrap')

const router = express.Router()

router.get('/', authUser, asyncWrap(getAllUserHistory))
router.get('/:deviceId', authUser, asyncWrap(getAllDeviceHistory))

module.exports = router
