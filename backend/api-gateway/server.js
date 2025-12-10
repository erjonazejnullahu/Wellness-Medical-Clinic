require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/auth', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true, pathRewrite: {'^/auth': '/api/auth'} }));
app.use('/patients', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true, pathRewrite: {'^/patients':'/api/patients'} }));
app.use('/doctors', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true, pathRewrite: {'^/doctors':'/api/doctors'} }));

app.listen(4000, () => console.log('API Gateway listening on 4000'));
