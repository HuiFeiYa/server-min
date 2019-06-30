const createModel = require('../../utils/create.js')
const Sequelize = require('sequelize')
const instance = createModel({
  database: 'minprogram'
})
const Model = instance(
  'login',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    }
  },
  { timestamps: false }
)
module.exports = Model
