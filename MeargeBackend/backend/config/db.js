const { Sequelize } = require('sequelize');
const config = require('./serviceConfig');

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  dialect: config.dbDialect,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
  } catch (error) {

  }
}

testConnection();

module.exports = sequelize;
