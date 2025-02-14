const express = require('express');
const router = express()
const ExchangeCurrency = require('../models/Exchange_currency')
const Currency = require('../models/Currency')
const getRateData = require('./rateData'); 
const moment = require('moment-timezone');

// Crear una tasa
router.post('/', async (req, res) => {
    const { moneda, tasa, fecha } = req.body;
  
    try {
      // Buscar la moneda por su código (ISO)
      const currency = await Currency.findOne({ where: { code: moneda } });
  
      if (!currency) {
        currency = await Currency.create({ name: 'Dolar', code: 'USD', symbol: '$'})
        //return res.status(404).json({ error: 'Moneda no encontrada' });
      }
  
      // Crear el objeto con el ID de la moneda
      const newExchangeRate = {
        currency_id: currency.id,
        rate: tasa,
        date: new Date(fecha)
      };
  
      // Crear la nueva tasa en la base de datos
      const exchangeRates = await ExchangeCurrency.create(newExchangeRate);
  
      res.status(201).json(exchangeRates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // Obtener tasas de cambio ordenadas por fecha de manera descendente y paginada
router.get('/', async (req, res) => {
    try {
      // Obtener parámetros de paginación de la solicitud (página y límite)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      // Obtener tasas de cambio ordenadas por fecha descendente
      const exchangeRates = await ExchangeCurrency.findAll({
        order: [['date', 'DESC']],
        limit: limit,
        offset: offset,
        include: Currency
      });
  
      res.status(200).json(exchangeRates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/today', async (req, res) => {
    try {
      const today = moment().tz('America/Caracas').format('YYYY-MM-DD');
  
      // Consulta la tasa de cambio para la fecha de hoy
      let todayRate = await ExchangeCurrency.findOne({
        where: { date: today },
        include: Currency
      });
  
      if (!todayRate) {
        // Si no existe la tasa de cambio del día de hoy, intenta crearla
        const currency = await Currency.findOne({ where: { iso: "USD" } });
        const rate = await getRateData();
  
        if (!rate) {
          // Si `getRateData` no devuelve una tasa, responde con un error
          return res.status(500).json({
            message: 'No se pudo obtener la tasa de cambio actual.'
          });
        }
  
        const newExchangeRate = {
          currency_id: currency.id,
          rate: rate,
          date: today
        };
  
        // Crear la nueva tasa en la base de datos
        const exchangeRates = await ExchangeCurrency.create(newExchangeRate);
  
        return res.status(201).json({
          message: 'Tasa de cambio creada exitosamente',
          exchangeRate: exchangeRates
        });
      } else {
        // Si la tasa ya existe, la devuelve
        return res.status(200).json(todayRate);
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  module.exports = router;