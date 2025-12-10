require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Auth DB connected');
    // optional: await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Auth service listening on ${PORT}`));
  } catch (err) {
    console.error('Unable to start auth service:', err);
  }
}
start();