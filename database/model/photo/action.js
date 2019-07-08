const Model = require('./index')
async function findAllPhoto() {
  return Model.findAll()
}
async function insertPhoto(option) {
  return Model.create(option)
}
module.exports = {
  findAllPhoto,
  insertPhoto
}
