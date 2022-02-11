const APIStatus = require('../constants/APIStatus')
const { changeOnClickWeightDb, createPresetFeedDb, updatePresetFeedDb, deletePresetFeedDb, updatePetDetectedFeedDb, changePetDetectedStatusDb } = require('../db/feeding.db')
const { getDeviceByDeviceIdDb } = require('../db/device.db')
const apiResponse = require('../utils/apiResponse')
const convertTimeSchedule = require('../utils/convertTimeSchedule')
const mqttClient = require('../services/mqtt.service')

const feedOnClick = async (req, res, next) => {
  const user = req.user
  const { deviceId } = req.params

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))
  const device = await getDeviceByDeviceIdDb({ deviceId })
  if (device.petDetectedFeedWeight.status === 'on') return res.status(200).json(apiResponse({ status: APIStatus.FAIL, msg: 'Bạn không thể cho ăn trực tiếp khi đang ở chế độ cho ăn tự động' }))

  const message = {
    DeviceId: deviceId,
    Task: '1',
    Weight: device.onClickFeedWeight
  }
  mqttClient.publish(`/command/${deviceId}`, JSON.stringify(message))

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'Your pet is feeded' }))
}

const changeOnClickWeight = async (req, res, next) => {
  const user = req.user
  const { deviceId } = req.params
  const { weight } = req.body

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))
  await changeOnClickWeightDb({ weight, deviceId })

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'onclickweight is updated' }))
}

const createPresetFeed = async (req, res, next) => {
  const user = req.user
  const { deviceId } = req.params
  const { status, weight, date } = req.body

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  const rs = await createPresetFeedDb({ deviceId, status, weight, date })
  if (rs.petDetectedFeedWeight.status === 'on') {
    return res.status(200).json(apiResponse({ status: APIStatus.FAIL, msg: 'Lịch đặt sẽ chạy khi tắt chức năng cho ăn tự động', data: rs }))
  }

  const { weight: presetWeight, timeSchedule } = convertTimeSchedule(rs.presetFeed)
  const message = {
    DeviceId: deviceId,
    Task: '3',
    Weight: presetWeight,
    TimeSchedule: timeSchedule
  }
  mqttClient.publish(`/command/${deviceId}`, JSON.stringify(message))

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'Đặt lịch thành công',data: rs }))
}

const updatePresetFeed = async (req, res, next) => {
  const user = req.user
  const { deviceId, presetId } = req.params
  const { status, weight, date } = req.body

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  const rs = await updatePresetFeedDb({ deviceId, presetId, status, weight, date })
  if (!rs) return res.status(404).json(apiResponse({ status: APIStatus.FAIL, msg: 'This preset doesnt exist' }))

  if (rs.petDetectedFeedWeight.status === 'on') {
    return res.status(200).json(apiResponse({ status: APIStatus.FAIL, msg: 'Lịch đặt sẽ chạy khi tắt chức năng cho ăn tự động', data: rs }))
  }

  const { weight: presetWeight, timeSchedule } = convertTimeSchedule(rs.presetFeed)
  const message = {
    DeviceId: deviceId,
    Task: '3',
    Weight: presetWeight,
    TimeSchedule: timeSchedule
  }
  mqttClient.publish(`/command/${deviceId}`, JSON.stringify(message))  

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: rs }))
}

const deletePresetFeed = async (req, res, next) => {
  const user = req.user
  const { deviceId, presetId } = req.params

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  const rs = await deletePresetFeedDb({ deviceId, presetId })
  if (!rs) return res.status(404).json(apiResponse({ status: APIStatus.FAIL, msg: 'This preset doesnt exist' }))

  if(rs.petDetectedFeedWeight.status === 'off') {
    const { weight, timeSchedule } = convertTimeSchedule(rs.presetFeed)
    const message = {
      DeviceId: deviceId,
      Task: '3',
      Weight: weight,
      TimeSchedule: timeSchedule
    }
    mqttClient.publish(`/command/${deviceId}`, JSON.stringify(message))  
  }

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: rs }))
}

const updatePetDetectedFeed = async (req, res, next) => {
  const user = req.user
  const { deviceId } = req.params
  const { weight } = req.body

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  const rs = await updatePetDetectedFeedDb({ deviceId, weight })
  if (rs.petDetectedFeedWeight.status === 'on') {
    const message = {
      DeviceId: deviceId,
      Task: '2',
      Weight: weight
    }
    mqttClient.publish(`/command/${deviceId}`, JSON.stringify(message))
  }

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'update pet detected successfully', data: rs }))
}

const changePetDetectedStatus = async (req, res, next) => {
  const user = req.user
  const { deviceId } = req.params
  const { status } = req.body

  if (!user.devices.includes(deviceId)) return res.status(400).json(apiResponse({ status: APIStatus.FAIL, msg: 'You dont have this device' }))

  const rs = await changePetDetectedStatusDb({ deviceId, status })
  if (rs.petDetectedFeedWeight.status === 'on') {
    const message = {
      DeviceId: deviceId,
      Task: '2',
      Weight: rs.petDetectedFeedWeight.weight
    }
    mqttClient.publish(`/command/${deviceId}`, JSON.stringify(message))
  } else {
    const { weight, timeSchedule } = convertTimeSchedule(rs.presetFeed)
    const message = {
      DeviceId: deviceId,
      Task: '3',
      Weight: weight,
      TimeSchedule: timeSchedule
    }
    mqttClient.publish(`/command/${deviceId}`, JSON.stringify(message))  
  }
  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, msg: 'change pet detected status successfully', data: rs }))
}

module.exports = {
  feedOnClick,
  changeOnClickWeight,
  createPresetFeed,
  updatePresetFeed,
  deletePresetFeed,
  updatePetDetectedFeed,
  changePetDetectedStatus
}
