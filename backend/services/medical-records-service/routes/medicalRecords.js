const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const { MedicalRecord } = require('../models');

const router = express.Router();

/* Create medical record */
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Doctors only' });
    }

    const {
      appointment_id,
      diagnosis,
      symptoms,
      medication,
      treatment_notes
    } = req.body;

    // FETCH APPOINTMENT FROM APPOINTMENT SERVICE
    const response = await axios.get(
      `http://localhost:5003/api/appointments/${appointment_id}`,
      {
        headers: { Authorization: req.headers.authorization }
      }
    );

    const appointment = response.data;

    const record = await MedicalRecord.create({
      appointment_id,
      patient_user_id: appointment.patient_user_id,
      doctor_user_id: appointment.doctor_user_id,
      diagnosis,
      symptoms,
      medication,
      treatment_notes
    });

    res.status(201).json(record);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to create medical record' });
  }
});

/* Get record by appointment */
router.get('/appointment/:appointment_id', auth, async (req, res) => {
  const record = await MedicalRecord.findOne({
    where: { appointment_id: req.params.appointment_id }
  });

  res.json(record);
});

/* Update */
router.put('/:id', auth, async (req, res) => {
  await MedicalRecord.update(req.body, {
    where: { id: req.params.id, doctor_user_id: req.user.id }
  });

  res.json({ message: 'Updated' });
});

/* Delete */
router.delete('/:id', auth, async (req, res) => {
  await MedicalRecord.destroy({
    where: { id: req.params.id, doctor_user_id: req.user.id }
  });

  res.json({ message: 'Deleted' });
});

module.exports = router;
