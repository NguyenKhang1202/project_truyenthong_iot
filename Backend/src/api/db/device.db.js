const Device = require('../models/device.model')
const User = require('../models/user.model')

const getAllDevicesDb = async (query) => {
  const devices = await Device.find()

  return {
    devices,
    totalDevices: devices.length
  }
}

const getAllUserDevicesDb = async (query) => {
  const { userId } = query
  const user = await User.findById(userId)
  const deviceIds = user.devices

  const promises = deviceIds.map((id) => {
    return Device.findOne({ deviceId: id })
  })

  const devices = await Promise.all(promises)

  return {
    devices
  }
}

const getDeviceByDeviceIdDb = async (query) => {
  const { deviceId } = query
  const device = await Device.findOne({ deviceId })

  return device
}

const createDeviceDb = async (query) => {
  const { deviceId, deviceName, userId } = query
  const device = await new Device({ deviceId, deviceName }).save()
  const user = await User.findById(userId)
  user.devices.push(deviceId)
  await user.save()

  return device
}

const deleteDeviceDb = async (query) => {
  const { deviceId, userId } = query
  const rs = await Device.findOneAndDelete({ deviceId })
  const user = await User.findById(userId)
  user.devices = user.devices.filter(id => id !== deviceId)
  await user.save()

  return rs
}

module.exports = {
  getAllDevicesDb,
  getAllUserDevicesDb,
  getDeviceByDeviceIdDb,
  createDeviceDb,
  deleteDeviceDb
}
