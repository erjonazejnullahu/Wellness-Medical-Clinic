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