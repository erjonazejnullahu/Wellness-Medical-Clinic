const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Patient', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    date_of_birth: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.STRING(20) },
    phone: { type: DataTypes.STRING(50) },
    insurance_info: { type: DataTypes.STRING(255) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Patients',
    timestamps: false
  });
};