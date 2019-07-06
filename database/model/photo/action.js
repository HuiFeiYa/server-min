const Model = require('./index')
async function findAllPhoto() {
  return Model.findAll()
}
module.exports = {
  findAllPhoto
}
