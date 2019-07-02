const Model = require('./index')
async function findAll() {
  return Model.findAll()
}
async function findByUnionid(unionid) {
  return Model.findAll({
    where: { unionid }
  })
}
async function insertLogin(params) {
  return Model.create(params)
}
module.exports = {
  findAll,
  insertLogin,
  findByUnionid
}
