const { Joi } = require('express-validation')

const createDeviceValidation = {
  body: Joi.object({
    deviceId: Joi.string().required(),
    deviceName: Joi.string()
  })
}

module.exports = { createDeviceValidation }
