require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const appointmentRoutes = require('./routes/appointments');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5003;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Appointment DB connected');
    app.listen(PORT, () =>
      console.log(`Appointment service running on ${PORT}`)
    );
  } catch (err) {
    console.error(err);
  }
}

start();
