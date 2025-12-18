require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// AUTH SERVICE
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:5000/api/auth',
  changeOrigin: true
}));

// PATIENT SERVICE
app.use('/patients', createProxyMiddleware({
  target: 'http://localhost:5001/api/patients',
  changeOrigin: true
}));

//DOCTOR SERVICE
app.use('/doctors', createProxyMiddleware({
  target: 'http://localhost:5002/api/doctors',
  changeOrigin: true
}));

app.listen(4000, () => {
  console.log('API Gateway listening on 4000');
});
