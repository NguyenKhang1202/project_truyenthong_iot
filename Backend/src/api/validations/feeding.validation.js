const { Joi } = require('express-validation')
const ObjectId = require('mongoose').Types.ObjectId

const changeOnClickWeightValidation = {
  body: Joi.object({
    weight: Joi.number().required()
  })
}

const createPresetFeedValidation = {
  body: Joi.object({
    status: Joi.string().valid('on', 'off').required(),
    weight: Joi.number().required(),
    date: Joi.string().required()
  })
}

const updatePresetFeedValidation = {
  body: Joi.object({
    status: Joi.string().valid('on', 'off').required(),
    weight: Joi.number().required(),
    date: Joi.string().required()
  }),
  params: Joi.object({
    deviceId: Joi.string().required(),
    presetId: Joi.string().custom((value, helper) => {
      if (!ObjectId.isValid(value)) {
        return helper.message('presetId must be an ObjectId')
      } else return true
    }).required()
  })
}

const deletePresetFeedValidation = {
  params: Joi.object({
    deviceId: Joi.string().required(),
    presetId: Joi.string().custom((value, helper) => {
      if (!ObjectId.isValid(value)) {
        return helper.message('presetId must be an ObjectId')
      } else return true
    }).required()
  })
}

const updatePetDetectedFeedValidation = {
  params: Joi.object({
    deviceId: Joi.string().required()
  }),
  body: Joi.object({
    weight: Joi.number().required()
  })
}

const changePetDetectedStatusValidation = {
  params: Joi.object({
    deviceId: Joi.string().required()
  }),
  body: Joi.object({
    status: Joi.string().valid('on', 'off').required()
  })
}

module.exports = {
  changeOnClickWeightValidation,
  createPresetFeedValidation,
  updatePresetFeedValidation,
  deletePresetFeedValidation,
  updatePetDetectedFeedValidation,
  changePetDetectedStatusValidation
}
