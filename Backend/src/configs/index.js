require('dotenv-safe').config()

const port = process.env.PORT
const jwtKey = process.env.JWT_KEY
const mongodbUri = process.env.MONGODB_URI
const emailHost = process.env.EMAIL_HOST
const emailPort = process.env.EMAIL_PORT
const emailUser = process.env.EMAIL_USER
const emailPassword = process.env.EMAIL_PASSWORD

const userConfig = {
  genders: {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
  }
}

const emailConfig = {
  host: emailHost,
  port: emailPort,
  user: emailUser,
  pass: emailPassword
}

module.exports = {
  pagination: {
    page: 1,
    records: 10
  },
  port,
  mongodbUri,
  jwtKey,
  userConfig,
  emailConfig
}
