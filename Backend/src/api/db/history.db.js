const FeedHistory = require('../models/feedHistory.model')
const User = require('../models/user.model')

const getAllUserHistoryDb = async (query) => {
  const { userId } = query
  const user = await User.findById(userId)
  const deviceIds = user.devices

  const promises = deviceIds.map((id) => {
    return FeedHistory.findOne({ deviceId: id })
  })

  const histories = await Promise.all(promises)

  return histories
}

const getAllDeviceHistoryDb = async (query) => {
  const { deviceId } = query

  const res = await FeedHistory.findOne({ deviceId })

  return res
}

const createHistoryDb = async (query) => {
  const { deviceId, weight, time } = query
  const history = await FeedHistory.findOne({ deviceId })
  if (!history) {
    const newHistory = new FeedHistory({ deviceId })
    newHistory.detail.push({ weight, time })
    const res = await newHistory.save()
    return res
  }

  history.detail.push({ weight, time })
  const res = await history.save()
  return res
}

module.exports = {
  getAllDeviceHistoryDb,
  getAllUserHistoryDb,
  createHistoryDb
}
