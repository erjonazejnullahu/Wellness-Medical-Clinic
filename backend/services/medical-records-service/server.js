require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes/medicalRecords');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/medical-records', routes);

const PORT = process.env.PORT || 5004;

(async () => {
  await sequelize.authenticate();
  console.log('Medical Records DB connected');
  app.listen(PORT, () =>
    console.log(`Medical Records service on ${PORT}`)
  );
})();
