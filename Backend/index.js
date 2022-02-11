const express = require('express')
const { ValidationError } = require('express-validation')
const fileUpload = require('express-fileupload')
const path = require('path')
const cors = require('cors')

const APIStatus = require('./src/api/constants/APIStatus')
const { port } = require('./src/configs')
const authRouter = require('./src/api/routes/auth.route')
const userRouter = require('./src/api/routes/user.route')
const deviceRouter = require('./src/api/routes/device.route')
const feedingRouter = require('./src/api/routes/feeding.route')
const historyRouter = require('./src/api/routes/history.route')
const adminRouter = require('./src/api/routes/admin.route')
const apiResponse = require('./src/api/utils/apiResponse')
const mqttClient = require('./src/api/services/mqtt.service')

require('./src/api/db/mongoose')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({ parseNested: true }))
app.use(express.static(path.join(__dirname, './src/api/static')))

app.use('/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/devices', deviceRouter)
app.use('/api/feeding', feedingRouter)
app.use('/api/history', historyRouter)
app.use('/api/dashboard', adminRouter)

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res
      .status(err.statusCode)
      .json(
        apiResponse({
          status: APIStatus.FAIL,
          msg: 'validation failed',
          data: { details: err.details }
        })
      )
  }

  console.log(err)
  return res
    .status(500)
    .json(
      apiResponse({ status: APIStatus.ERROR, msg: 'Internal Server error' })
    )
})

app.listen(port, () => {
  console.log(`Server is lisening on port ${port}`)
})

module.exports = app
