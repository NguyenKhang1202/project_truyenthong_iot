const nodemailer = require('nodemailer')

const { emailConfig } = require('../../configs')

const { host, port, user, pass } = emailConfig
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: {
    user,
    pass
  }
})

const sendEmail = async (to, subject, text, content) => {
  return await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
    html: `<b>${content}</b>`
  })
}

module.exports = sendEmail
