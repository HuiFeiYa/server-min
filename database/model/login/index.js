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
    },
    nickName: Sequelize.STRING(20),
    gender: Sequelize.STRING(200),
    avatarUrl: Sequelize.BIGINT,
    timestamp: Sequelize.STRING(20),
    openid: Sequelize.STRING(40),
    unionid: Sequelize.STRING(40)
  },
  { timestamps: false }
)
module.exports = Model
