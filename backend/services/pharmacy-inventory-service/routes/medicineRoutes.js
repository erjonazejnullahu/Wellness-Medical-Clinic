const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Medicine routes are working' });
});

// CRUD route
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);
router.post('/', medicineController.createMedicine);
router.put('/:id', medicineController.updateMedicine);      
router.delete('/:id', medicineController.deleteMedicine);   

module.exports = router;