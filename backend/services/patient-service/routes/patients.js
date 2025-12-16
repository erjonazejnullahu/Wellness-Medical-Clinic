const express = require('express');
const { Patient } = require('../models');

const router = express.Router();

// Create patient (called by auth-service)
router.post('/', async (req, res) => {
  try {
    const { user_id, first_name, last_name, date_of_birth, gender, phone, insurance_info } = req.body;
    if (!user_id || !first_name || !last_name) return res.status(400).json({ message: 'Missing required fields' });

    const created = await Patient.create({ user_id, first_name, last_name, date_of_birth, gender, phone, insurance_info });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//Get user by id
router.get('/user/:user_id', async (req, res) => {
  const patient = await Patient.findOne({
    where: { user_id: req.params.user_id }
  });

  if (!patient) return res.status(404).json({ message: 'Not found' });
  res.json(patient);
});

module.exports = router;