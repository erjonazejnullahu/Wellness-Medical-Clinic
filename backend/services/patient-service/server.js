require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const patientRoutes = require('./routes/patients');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Patient DB connected');
    // await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Patient service listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
}
start();
