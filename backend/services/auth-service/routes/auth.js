const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../models');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Register patient (public)
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, date_of_birth, gender, phone, insurance_info } = req.body;
    if (!email || !password || !first_name || !last_name) return res.status(400).json({ message: 'Missing required fields' });

    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: hash, role: 'PATIENT' });

    // call patient-service to create patient profile
    const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'http://localhost:5001';
    await axios.post(`${patientServiceUrl}/api/patients`, {
      user_id: user.id,
      first_name, last_name, date_of_birth, gender, phone, insurance_info
    });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login (public)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Admin creates doctor (protected admin only)
router.post('/create-doctor', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { email, password, first_name, last_name, specialization, license_number, years_of_experience } = req.body;
    if (!email || !password || !first_name || !last_name || !license_number) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: hash, role: 'DOCTOR' });

    // call doctor-service to create doctor profile
    const doctorServiceUrl = process.env.DOCTOR_SERVICE_URL || 'http://localhost:5002';
    await axios.post(`${doctorServiceUrl}/api/doctors`, {
      user_id: user.id,
      first_name, last_name, specialization, license_number, years_of_experience
    });

    res.status(201).json({ message: 'Doctor created', user: { id: user.id, email: user.email }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
// Get logged-in user basic info
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
});

module.exports = router;