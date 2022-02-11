const { getAllDeviceHistoryDb, getAllUserHistoryDb } = require('../db/history.db')
const apiResponse = require('../utils/apiResponse')
const APIStatus = require('../constants/APIStatus')

const getAllUserHistory = async (req, res, next) => {
  const user = req.user
  const histories = await getAllUserHistoryDb({ userId: user._id })
  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: histories }))
}

const getAllDeviceHistory = async (req, res, next) => {
  const { deviceId } = req.params
  const user = req.user
  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  const histories = await getAllDeviceHistoryDb({ deviceId })

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: histories }))
}

module.exports = {
  getAllDeviceHistory,
  getAllUserHistory
}
