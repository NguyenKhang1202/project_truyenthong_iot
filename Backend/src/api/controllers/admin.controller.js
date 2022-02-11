const { getAllDevicesDb } = require('../db/device.db')
const { getAllUserDb } = require('../db/user.db')
const apiResponse = require('../utils/apiResponse')
const APIStatus = require('../constants/APIStatus')

const getStatistic = async (req, res, next) => {
  const [devices, users] = await Promise.all([getAllDevicesDb(), getAllUserDb({ role: 'user' })])

  return res.status(200).json(apiResponse({ status: APIStatus.SUCCESS, data: { devices, users } }))
}

module.exports = {
  getStatistic
}
