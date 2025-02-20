require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const  initDb  = require('./models/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const url = '/api/'
app.use( url + 'expenses', require('./routes/expenses'));
app.use( url + 'transactions', require('./routes/transactions'));
app.use( url + 'settings', require('./routes/settings'));
app.use( url + 'settings/exchange-rate', require('./routes/exchangeCurrency'));

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});