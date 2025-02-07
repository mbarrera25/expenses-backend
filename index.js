require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url = '/api/'
app.use( url + 'expenses', require('./routes/expenses'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await sequelize.sync({ force: false }); // Sincroniza modelos con la BD
  console.log(`Server running on port ${PORT}`);
});