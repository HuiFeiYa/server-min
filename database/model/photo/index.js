const createModel = require('../../utils/create.js')
const Sequelize = require('sequelize')
const instance = createModel({
  database: 'minprogram'
})
const Model = instance(
  'photo',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    pic: Sequelize.STRING(200),
    content: Sequelize.STRING(200),
    time: Sequelize.STRING(200),
    unionid: Sequelize.BIGINT
  },
  { timestamps: false }
)
module.exports = Model
