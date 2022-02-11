const APIStatus = require('../constants/APIStatus')
const { getAllUserDevicesDb, getDeviceByDeviceIdDb, createDeviceDb, deleteDeviceDb } = require('../db/device.db')
const apiResponse = require('../utils/apiResponse')
const deviceIdsList = require('../db/deviceIdLists')

const getAllUserDevices = async (req, res, next) => {
  const devices = await getAllUserDevicesDb({ userId: req.user._id })

  return res.status(200).json(apiResponse({
    status: APIStatus.SUCCESS,
    data: devices
  }))
}

const getDevice = async (req, res, next) => {
  const { id: deviceId } = req.params
  const user = req.user

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  const device = await getDeviceByDeviceIdDb({ deviceId })

  if (!device) return res.status(404).json(apiResponse({ status: APIStatus.FAIL, msg: 'This device does not exist' }))
  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: device }))
}

const createDevice = async (req, res, next) => {
  const { deviceId, deviceName } = req.body
  const user = req.user

  if (!deviceIdsList.includes(deviceId)) return res.status(404).json(apiResponse({ status: APIStatus.FAIL, msg: 'Wrong device ID' }))
  if (user.devices.includes(deviceId)) return res.status(200).json(apiResponse({ status: APIStatus.FAIL, msg: 'Bạn đã có thiết bị này' }))

  const device = await createDeviceDb({ deviceId, deviceName, userId: user._id })
  return res.status(201).json(apiResponse({ status: APIStatus.SUCCESS, data: device }))
}

const deleteDevice = async (req, res, next) => {
  const { id: deviceId } = req.params
  const user = req.user

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  await Promise.all([deleteDeviceDb({ deviceId, userId: user._id })])
  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'Delete device successfully' }))
}

module.exports = {
  getAllUserDevices,
  getDevice,
  createDevice,
  deleteDevice
}
