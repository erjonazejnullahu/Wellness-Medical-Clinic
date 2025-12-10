const { Sequelize } = require('sequelize');
const UserModel = require('./user');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});

const User = UserModel(sequelize);

module.exports = { sequelize, User };
