const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    patient_user_id: { type: DataTypes.INTEGER, allowNull: false },
    doctor_user_id: { type: DataTypes.INTEGER, allowNull: false },

    appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
    appointment_time: { type: DataTypes.TIME, allowNull: false },

    reason: DataTypes.STRING,
    notes: DataTypes.TEXT,

    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING'
    }
  }, {
    tableName: 'Appointments',
    timestamps: false
  });
};
