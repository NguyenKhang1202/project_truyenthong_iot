const mongoose = require('mongoose')
const Device = require('../models/device.model')

const changeOnClickWeightDb = async (query) => {
  const { weight, deviceId } = query
  const device = await Device.findOne({ deviceId })

  device.onClickFeedWeight = weight
  const rs = await device.save()

  return rs
}

const createPresetFeedDb = async (query) => {
  const { deviceId, ...preset } = query
  const device = await Device.findOne({ deviceId })

  device.presetFeed.push(preset)
  const rs = await device.save()

  return rs
}

const updatePresetFeedDb = async (query) => {
  const { deviceId, presetId, status, weight, date } = query
  const device = await Device.findOne({ deviceId })
  const presets = device.presetFeed

  const index = presets.findIndex(obj => obj._id.equals(mongoose.Types.ObjectId(presetId)))
  if (index === -1) return null
  presets[index].status = status
  presets[index].weight = weight
  presets[index].date = date

  const rs = await device.save()
  return rs
}

const deletePresetFeedDb = async (query) => {
  const { deviceId, presetId } = query
  const device = await Device.findOne({ deviceId })

  device.presetFeed = device.presetFeed.filter(obj => !obj._id.equals(mongoose.Types.ObjectId(presetId)))

  const rs = await device.save()
  return rs
}

const updatePetDetectedFeedDb = async (query) => {
  const { deviceId, weight } = query
  const device = await Device.findOne({ deviceId })

  device.petDetectedFeedWeight.weight = weight

  const rs = await device.save()
  return rs
}

const changePetDetectedStatusDb = async (query) => {
  const { deviceId, status } = query
  const device = await Device.findOne({ deviceId })

  device.petDetectedFeedWeight.status = status

  const rs = await device.save()
  return rs
}

module.exports = {
  changeOnClickWeightDb,
  createPresetFeedDb,
  updatePresetFeedDb,
  deletePresetFeedDb,
  updatePetDetectedFeedDb,
  changePetDetectedStatusDb
}
