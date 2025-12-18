const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// CORS - lejo të gjitha metodat
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'meduser',
  password: 'medpass123',
  database: 'clinic'
});

console.log('✅ Connected to database: clinic');


// 1. GET ALL MEDICINES
app.get('/api/medicines', async (req, res) => {
  console.log('📋 GET /api/medicines');
  try {
    const [rows] = await pool.promise().query('SELECT * FROM medicines ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. CREATE NEW MEDICINE
app.post('/api/medicines', async (req, res) => {
  console.log('➕ POST /api/medicines', req.body);
  try {
    const { name, quantity, expiry_date, price, description } = req.body;
    
    const [result] = await pool.promise().query(
      'INSERT INTO medicines (name, quantity, expiry_date, price, description) VALUES (?, ?, ?, ?, ?)',
      [name, quantity, expiry_date, price, description || '']
    );
    
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: 'Medicine added successfully'
    });
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. UPDATE MEDICINE - KY MUNGONTE!
app.put('/api/medicines/:id', async (req, res) => {
  console.log(`✏️ PUT /api/medicines/${req.params.id}`, req.body);
  
  try {
    const { name, quantity, expiry_date, price, description } = req.body;
    
    // Bej update
    await pool.promise().query(
      'UPDATE medicines SET name = ?, quantity = ?, expiry_date = ?, price = ?, description = ? WHERE id = ?',
      [name, quantity, expiry_date, price, description || '', req.params.id]
    );
    
    res.json({
      success: true,
      message: 'Medicine updated successfully'
    });
    
  } catch (error) {
    console.error('PUT error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. DELETE MEDICINE 
app.delete('/api/medicines/:id', async (req, res) => {
  console.log(`🗑️ DELETE /api/medicines/${req.params.id}`);
  
  try {
    await pool.promise().query('DELETE FROM medicines WHERE id = ?', [req.params.id]);
    
    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    time: new Date().toISOString(),
    routes: [
      'GET    /api/medicines',
      'POST   /api/medicines',
      'PUT    /api/medicines/:id',   
      'DELETE /api/medicines/:id'     
    ]
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({
    message: 'API is working with FULL CRUD!',
    endpoints: {
      getAll: 'GET    /api/medicines',
      create: 'POST   /api/medicines',
      update: 'PUT    /api/medicines/:id',
      delete: 'DELETE /api/medicines/:id'
    }
  });
});

app.listen(5000, () => {
  console.log(`
`);
});