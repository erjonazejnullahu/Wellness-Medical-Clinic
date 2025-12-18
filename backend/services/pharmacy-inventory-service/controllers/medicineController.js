const { Medicine } = require('../models');

// GET all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      order: [['id', 'DESC']]
    });
    
    // Transform data for frontend compatibility
    const formattedMedicines = medicines.map(medicine => {
      // Format expiry_date for frontend
      let formattedDate = null;
      if (medicine.expiry_date) {
        const date = new Date(medicine.expiry_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
      
      return {
        id: medicine.id,
        name: medicine.name,
        quantity: medicine.quantity,
        expiry_date: formattedDate, // Use formatted date
        price: medicine.price,
        description: medicine.description,
        // Add dummy fields for frontend compatibility
        type: 'Tableta', // Default value
        supplier: 'Unknown' // Default value
      };
    });
    
    res.json(formattedMedicines);
  } catch (error) {
    console.error('❌ Error fetching medicines:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// GET medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    console.error('❌ Error fetching medicine:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// CREATE medicine
exports.createMedicine = async (req, res) => {
  try {
    console.log('📝 Creating medicine with data:', req.body);
    
    // FIXED: Changed from expiryDate to expiry_date
    const { name, quantity, expiry_date, price, description } = req.body;
    
    // Map frontend field names to database field names
    const medicineData = {
      name,
      quantity: parseInt(quantity),
      expiry_date: expiry_date, // Already correct - using expiry_date
      price: parseFloat(price),
      description: description || ''
    };

    console.log('📦 Mapped medicine data:', medicineData);

    const medicine = await Medicine.create(medicineData);

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      medicine: {
        ...medicine.toJSON(),
        expiry_date: medicine.expiry_date // Ensure consistency
      }
    });
  } catch (error) {
    console.error('❌ Error creating medicine:', error);
    res.status(500).json({ 
      error: 'Database error',
      details: error.message 
    });
  }
};

// UPDATE medicine
exports.updateMedicine = async (req, res) => {
  try {
    console.log('✏️ Updating medicine ID:', req.params.id);
    console.log('New data:', req.body);

    // FIXED: Changed from expiryDate to expiry_date
    const { name, quantity, expiry_date, price, description } = req.body;
    const medicineId = req.params.id;

    const medicine = await Medicine.findByPk(medicineId);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Map frontend field names to database field names
    const updateData = {
      name,
      quantity: parseInt(quantity),
      expiry_date: expiry_date, // Already correct - using expiry_date
      price: parseFloat(price),
      description: description || ''
    };

    await medicine.update(updateData);

    console.log('✅ Medicine updated:', medicine);

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      medicine: {
        ...medicine.toJSON(),
        expiry_date: medicine.expiry_date // Ensure consistency
      }
    });
  } catch (error) {
    console.error('❌ Error updating medicine:', error);
    res.status(500).json({ 
      error: 'Database error',
      details: error.message 
    });
  }
};

// DELETE medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    console.log('🗑️ Deleting medicine ID:', medicineId);

    const medicine = await Medicine.findByPk(medicineId);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    await medicine.destroy();

    console.log('✅ Medicine deleted');

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting medicine:', error);
    res.status(500).json({ 
      error: 'Database error',
      details: error.message 
    });
  }
};