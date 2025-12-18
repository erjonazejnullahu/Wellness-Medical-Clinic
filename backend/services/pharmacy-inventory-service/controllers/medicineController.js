// Update medicine
exports.updateMedicine = async (req, res) => {
  try {
    console.log('✏️ Updating medicine ID:', req.params.id);
    console.log('New data:', req.body);
    
    const { name, quantity, expiry_date, price, description } = req.body;
    const medicineId = req.params.id;
    
    await db.query(
      'UPDATE medicines SET name = ?, quantity = ?, expiry_date = ?, price = ?, description = ? WHERE id = ?',
      [name, quantity, expiry_date, price, description || '', medicineId]
    );
    
    // Get updated medicine
    const [updatedMedicine] = await db.query('SELECT * FROM medicines WHERE id = ?', [medicineId]);
    
    console.log('✅ Medicine updated:', updatedMedicine[0]);
    
    res.json({
      success: true,
      message: 'Medicine updated successfully',
      medicine: updatedMedicine[0]
    });
    
  } catch (error) {
    console.error('❌ Error updating medicine:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    console.log('🗑️ Deleting medicine ID:', medicineId);
    
    await db.query('DELETE FROM medicines WHERE id = ?', [medicineId]);
    
    console.log('✅ Medicine deleted');
    
    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting medicine:', error);
    res.status(500).json({ error: 'Database error' });
  }
};