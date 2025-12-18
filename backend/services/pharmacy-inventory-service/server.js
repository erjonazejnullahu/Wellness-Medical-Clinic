const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import models first to initialize Sequelize
require('./models');

const medicineRoutes = require('./routes/medicineRoutes');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// INVENTORY ROUTES
app.use('/api/medicines', medicineRoutes);

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    service: 'Pharmacy Inventory',
    status: 'running',
    port: process.env.PORT,
    database: 'Connected'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(` Pharmacy Inventory Service running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API test: http://localhost:${PORT}/api/test`);
});