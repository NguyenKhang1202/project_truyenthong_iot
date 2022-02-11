const mongoose = require('mongoose')

const FeedHistorySchema = new mongoose.Schema({
  deviceId: {
    type: String
  },
  detail: [{
    _id: false,
    weight: {
      type: Number
    },
    time: {
      type: Date
    }
  }]
})

module.exports = mongoose.model('FeedHistory', FeedHistorySchema)
