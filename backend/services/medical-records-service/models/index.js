const { Sequelize } = require('sequelize');
const MedicalRecordModel = require('./medicalRecord');

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

const MedicalRecord = MedicalRecordModel(sequelize);

module.exports = { sequelize, MedicalRecord };
