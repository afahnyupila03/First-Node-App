const Sequelize = require('sequelize')

// Connect sequelize to mysql database
const sequelize = new Sequelize('node-complete', 'root', '682700549659438205', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = sequelize
