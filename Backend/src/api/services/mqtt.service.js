const mqtt = require('mqtt')
const { createHistoryDb } = require('../db/history.db')

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqttx_55c02efd`

const connectUrl = `mqtt://${host}:${port}`
const mqttClient = mqtt.connect(connectUrl, {

    username: 'Minh',
    password: 'Minh',

})

mqttClient.once('connect', function() {
    mqttClient.subscribe('/history')
    console.log('connect to mqtt successfully')
})

mqttClient.on('message', async(topic, msg) => {
    const message = JSON.parse(msg.toString())
    const { DeviceId, Weight, DateTime } = message

    await createHistoryDb({ deviceId: DeviceId, weight: Weight, time: DateTime })
})

mqttClient.on('error', function(error) {
    console.log('Unable to connect: ' + error)
    process.exit(1)
})

module.exports = mqttClient