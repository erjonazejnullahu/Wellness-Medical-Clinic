const express = require('express');
const axios = require('axios');
const { Doctor } = require('../models');

const router = express.Router();

// Create doctor (called by auth-service)
router.post('/', async (req, res) => {
  try {
    const { user_id, first_name, last_name, specialization, license_number, years_of_experience } = req.body;
    if (!user_id || !first_name || !last_name || !license_number) return res.status(400).json({ message: 'Missing required fields' });

    const created = await Doctor.create({ user_id, first_name, last_name, specialization, license_number, years_of_experience });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      attributes: ['id', 'first_name', 'last_name', 'specialization', 'license_number', 'years_of_experience']
    });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get doctor by user_id
router.get('/user/:user_id', async (req, res) => {
  const doctor = await Doctor.findOne({
    where: { user_id: req.params.user_id }
  });

  if (!doctor) return res.status(404).json({ message: 'Not found' });
  res.json(doctor);
});

// Get doctors with availability
router.get('/availability', async (req, res) => {
  try {
    let { date, time } = req.query;
    if (!date || !time) return res.status(400).json({ message: 'Missing date or time' });
    if (time.length === 5) time = `${time}:00`;

    const doctors = await Doctor.findAll();
    const appointmentServiceUrl = 'http://localhost:5003/api/appointments';

    const results = [];

    for (const doc of doctors) {
      let available = true;
      try {
        const conflictRes = await axios.get(
          `${appointmentServiceUrl}/doctor-conflict`,
          { params: { doctor_user_id: doc.user_id, date, time } }
        );
        available = !conflictRes.data.conflict;
      } catch (err) {
        console.error(`Conflict check failed for doctor ${doc.user_id}:`, err.message);
        available = false;
      }

      results.push({
        ...doc.toJSON(),
        available
      });
    }

    res.json(results);
  } catch (err) {
    console.error('Doctor availability error:', err.message);
    res.status(500).json({ message: 'Failed to fetch doctor availability' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const {
      first_name,
      last_name,
      specialization,
      license_number,
      years_of_experience
    } = req.body;

    await doctor.update({
      first_name,
      last_name,
      specialization,
      license_number,
      years_of_experience
    });

    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await doctor.destroy();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;