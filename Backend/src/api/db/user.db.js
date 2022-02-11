const User = require('../models/user.model')

const getAllUserDb = async (query) => {
  const [totalUsers, users] = await Promise.all([
    User.find(query).count(),
    User.find(query)
  ])

  return {
    users,
    totalUsers
  }
}

const getUserDb = async (query) => {
  const user = await User.findOne(query)

  return user
}

const createUserDb = async (query) => {
  const user = await new User(query).save()

  return user
}

const updateUserDb = async (query) => {
  const { userId, newInfo } = query
  const { phone, gender, avatar, fullName, address } = newInfo

  const user = await User.findById(userId)
  user.phone = phone
  user.gender = gender
  user.avatar = avatar
  user.fullName = fullName
  user.address = address

  const rs = await user.save()
  return rs
}

const updateUserPwDb = async (query) => {
  const { userId, password } = query
  const user = await User.findById(userId)
  user.password = password

  const rs = await user.save()
  return rs
}

module.exports = {
  getAllUserDb,
  getUserDb,
  createUserDb,
  updateUserDb,
  updateUserPwDb
}
