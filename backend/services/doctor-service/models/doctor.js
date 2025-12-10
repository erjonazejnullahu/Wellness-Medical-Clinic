const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Doctor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    specialization: { type: DataTypes.STRING(120) },
    license_number: { type: DataTypes.STRING(100), allowNull: false },
    years_of_experience: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'Doctors',
    timestamps: false
  });
};
