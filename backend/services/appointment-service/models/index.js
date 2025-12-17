const { Sequelize } = require('sequelize');
const AppointmentModel = require('./appointment');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

const Appointment = AppointmentModel(sequelize);

module.exports = { sequelize, Appointment };
