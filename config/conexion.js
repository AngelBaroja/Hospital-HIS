const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'hishospital',
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;