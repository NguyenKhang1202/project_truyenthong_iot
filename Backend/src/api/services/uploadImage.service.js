const { nanoid } = require('nanoid')
const fs = require('fs')
const path = require('path')

const uploadImageService = async (imageFile, relativePath) => {
  let imageLink

  try {
    const absolutePath = path.join(__dirname, '../../../static', relativePath)

    fs.mkdirSync(absolutePath, {
      recursive: true
    })

    const fileName = imageFile.name.trim()
    const indexOfDot = fileName.lastIndexOf('.')
    const temp =
      fileName.slice(0, indexOfDot) +
      nanoid() +
      fileName.slice(indexOfDot, fileName.length)
    const newName = temp.split(' ').join('-')
    const filePath = `${absolutePath}/${newName}`

    await imageFile.mv(filePath)
    imageLink = `${absolutePath}/${newName}`
  } catch (err) {
    return null
  }

  return imageLink
}

module.exports = uploadImageService
