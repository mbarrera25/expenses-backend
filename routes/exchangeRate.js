const express = require('express');
const router = express.Router();
const fetchAndSaveExchangeRate = require('./scheduledTask'); // Ajusta la ruta a tu función

router.post("/", async (req, res) => {
  try {
    await fetchAndSaveExchangeRate();
    res.status(200).json({ message: "Tasa de cambio actualizada manualmente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la tasa de cambio", error: error.message });
  }
});

module.exports = router;
