const Model = require('./index')
async function findAll() {
  return Model.findAll()
}
module.exports = {
  findAll
}
