require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const doctorRoutes = require('./routes/doctors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/doctors', doctorRoutes);

const PORT = process.env.PORT || 5002;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Doctor DB connected');
    // await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Doctor service listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
}
start();
