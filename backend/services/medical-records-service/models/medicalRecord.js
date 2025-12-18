const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('MedicalRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    appointment_id: { type: DataTypes.INTEGER, allowNull: false },
    doctor_user_id: { type: DataTypes.INTEGER, allowNull: false },
    patient_user_id: { type: DataTypes.INTEGER, allowNull: false },

    diagnosis: DataTypes.STRING,
    symptoms: DataTypes.TEXT,
    medication: DataTypes.TEXT,
    treatment_notes: DataTypes.TEXT
  }, {
    tableName: 'MedicalRecords',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
