const express = require('express');
const jwt = require('jsonwebtoken');
const { Appointment } = require('../models');

const router = express.Router();

/* Auth middleware */
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

/* 1️⃣ Patient requests appointment */
router.post('/', auth, async (req, res) => {
  const { doctor_user_id, appointment_date, appointment_time, reason, notes } = req.body;

  // Check availability
  const conflict = await Appointment.findOne({
    where: {
      doctor_user_id,
      appointment_date,
      appointment_time,
      status: 'CONFIRMED'
    }
  });

  if (conflict) {
    return res.status(409).json({ message: 'Doctor not available' });
  }

  const appt = await Appointment.create({
    patient_user_id: req.user.id,
    doctor_user_id,
    appointment_date,
    appointment_time,
    reason,
    notes
  });

  res.status(201).json(appt);
});

/* 2️⃣ Patient: My appointments */
router.get('/patient', auth, async (req, res) => {
  const list = await Appointment.findAll({
    where: { patient_user_id: req.user.id }
  });
  res.json(list);
});

/* 3️⃣ Doctor: Appointments */
router.get('/doctor', auth, async (req, res) => {
  const list = await Appointment.findAll({
    where: { doctor_user_id: req.user.id }
  });
  res.json(list);
});

/* 4️⃣ Doctor confirms */
router.put('/:id/confirm', auth, async (req, res) => {
  await Appointment.update(
    { status: 'CONFIRMED' },
    { where: { id: req.params.id, doctor_user_id: req.user.id } }
  );
  res.json({ message: 'Confirmed' });
});

/* 5️⃣ Doctor completes */
router.put('/:id/complete', auth, async (req, res) => {
  await Appointment.update(
    { status: 'COMPLETED' },
    { where: { id: req.params.id, doctor_user_id: req.user.id } }
  );
  res.json({ message: 'Completed' });
});

router.get('/doctor-conflict', async (req, res) => {
  const { doctor_user_id, date, time } = req.query;

  const conflict = await Appointment.findOne({
    where: {
      doctor_user_id,
      appointment_date: date,
      appointment_time: time,
      status: 'CONFIRMED'
    }
  });

  res.json({ conflict: !!conflict });
});


module.exports = router;
