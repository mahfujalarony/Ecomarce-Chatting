const { Sequelize } = require('sequelize')
const config = require('./serviceConfig')

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  port: config.dbPort,
  dialect: 'mysql',
  logging: false,
})

module.exports = sequelize
