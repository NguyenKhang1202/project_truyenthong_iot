const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String
  },
  onClickFeedWeight: {
    type: Number,
    default: 100
  },
  petDetectedFeedWeight: {
    status: {
      type: String,
      enum: ['on', 'off'],
      default: 'off'
    },
    weight: {
      type: Number,
      default: 100
    }
  },
  presetFeed: [{
    status: {
      type: String,
      enum: ['on', 'off'],
      default: 'off'
    },
    weight: {
      type: Number,
      default: 100
    },
    date: {
      type: String
    }
  }]
})

module.exports = mongoose.model('Device', DeviceSchema)
