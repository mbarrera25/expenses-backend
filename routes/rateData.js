const axios = require("axios");
const ExchangeRateLog = require("../models/Exchange_rate_log")

async function getRateData() {
    try {
      const response = await axios.get(
        "https://v6.exchangerate-api.com/v6/aa44279955ea67f215974911/latest/USD"
      );
      return response.data.conversion_rates.VES;
    } catch (error) {
      await ExchangeRateLog.create({ status: "Error", message: "Error al obtener o guardar la tasa de cambio: " + error.message });
      throw new Error("Error al obtener datos de la API: " + error.message);
    }
  }

  
module.exports = getRateData;