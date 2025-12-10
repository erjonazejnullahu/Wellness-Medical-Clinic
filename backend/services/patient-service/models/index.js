const { Sequelize } = require('sequelize');
const PatientModel = require('./patient');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});

const Patient = PatientModel(sequelize);

module.exports = { sequelize, Patient };




