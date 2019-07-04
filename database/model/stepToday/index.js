const createModel = require('../../utils/create.js')
const Sequelize = require('sequelize')
const instance = createModel({
  database: 'minprogram'
})
const Model = instance(
  'step',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    heartTimes: Sequelize.STRING(200),
    name: Sequelize.STRING(200),
    date: Sequelize.STRING(200),
    steps: Sequelize.STRING(200),
    pic: Sequelize.STRING(200)
  },
  { timestamps: false }
)
module.exports = Model
