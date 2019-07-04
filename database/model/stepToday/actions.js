const Model = require('./index')
async function findAllStep() {
  return Model.findAll()
}
async function findByName(key, value) {
  return Model.findOne({
    where: {
      [key]: value
    }
  })
}
module.exports = {
  findAllStep,
  findByName
}
