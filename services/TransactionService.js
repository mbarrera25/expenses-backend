const { Op, Sequelize } = require('sequelize');
const Transaction = require('../models/Transaction'); // Ajusta la ruta
const Types = require("../models/Types")
const Currency = require("../models/Currency")
class TransactionService {
  getBalancePorMoneda = async () => {
    return await Transaction.findAll({
      attributes: [
        [
          Sequelize.col('transactionCurrency.symbol'),
          'currency'
        ],
        [
          Sequelize.fn(
            'SUM',
            Sequelize.literal(`amount * (CASE "transactionType"."operation" WHEN '+' THEN 1 ELSE -1 END)`)
          ),
          'amount'
        ]
      ],
      include: [
        {
          model: Types,
          as: 'transactionType',
          attributes: [],
          required: true,
          where: { include_is_balance: true }
        },
        {
          model: Currency,
          as: 'transactionCurrency',
          attributes: [],
          required: true,
        },
      ],
      group: ['transactionCurrency.symbol']
    });
  }
}

module.exports = TransactionService;