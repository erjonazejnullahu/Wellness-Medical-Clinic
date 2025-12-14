const express = require('express');
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

module.exports = router;