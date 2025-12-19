const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
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

/* 2️⃣ PATIENT: My appointments (WITH DOCTOR NAME) */
router.get('/patient', auth, async (req, res) => {
  try {
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appointments = await Appointment.findAll({
      where: { patient_user_id: req.user.id },
      order: [
        ['appointment_date', 'DESC'],
        ['appointment_time', 'DESC']
      ]
    });

   
    for (let apt of appointments) {
      try {
        const doctorRes = await axios.get(
          `http://localhost:5002/api/doctors/user/${apt.doctor_user_id}`
        );

        apt.dataValues.doctor_name =
          `${doctorRes.data.first_name} ${doctorRes.data.last_name}`;
      } catch {
        apt.dataValues.doctor_name = 'Unknown Doctor';
      }
    }

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

/* 3️⃣ DOCTOR: Appointments */
router.get('/doctor', auth, async (req, res) => {
  if (req.user.role !== 'DOCTOR') {
    return res.status(403).json({ message: 'Access denied' });
  }

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

/* 6️⃣ Availability check */
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

//Get appintment by id
router.get('/:id', auth, async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  // Allow only doctor or patient involved
  if (
    appointment.doctor_user_id !== req.user.id &&
    appointment.patient_user_id !== req.user.id
  ) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(appointment);
});

module.exports = router;
