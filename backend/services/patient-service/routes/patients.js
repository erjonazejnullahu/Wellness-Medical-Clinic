const express = require('express');
const { Patient } = require('../models');

const router = express.Router();

// Get all patients (Temporarily remove auth)
router.get('/', async (req, res) => {
  try { 
    const patients = await Patient.findAll({
      order: [['created_at', 'DESC']]
    });
    
    // Add this line back - it was missing!
    res.json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Create patient
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

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, insurance_info } = req.body;
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.update({
      first_name: first_name || patient.first_name,
      last_name: last_name || patient.last_name,
      date_of_birth: date_of_birth || patient.date_of_birth,
      gender: gender || patient.gender,
      phone: phone || patient.phone,
      insurance_info: insurance_info || patient.insurance_info
    });

    res.json({ message: 'Patient updated successfully', patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.destroy();
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get patient by user_id
router.get('/user/:user_id', async (req, res) => {
  const patient = await Patient.findOne({
    where: { user_id: req.params.user_id }
  });

  if (!patient) return res.status(404).json({ message: 'Not found' });
  res.json(patient);
});

module.exports = router;