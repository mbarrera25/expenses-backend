const express = require('express');
const router = express.Router();
const { Op, Sequelize, where } = require('sequelize');
const TransactionService = require('../services/TransactionService');
const transactionService = new TransactionService();

const Transaction = require("../models/Transaction");
const Types = require('../models/Types')
const Currency = require('../models/Currency');
const Categories = require('../models/Categories');
const PaymentMethods = require('../models/PaymentMethods');


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * limit;

        let { count, rows: transactions } = await Transaction.findAndCountAll({
            limit,
            offset,
            order: [['date', 'DESC']],
            include:[
                {
                  model:Types,
                  as: 'transactionType',
                  attributes:['id','name']
                },
                {
                  model: Categories,
                  as: 'transactionCategory',
                  attributes:['id','name']
                },
                {
                  model: Currency,
                  as: 'transactionCurrency',
                  attributes:['id','name']
                },
                {
                  model: PaymentMethods,
                  as: 'transactionPaymenMethod',
                  attributes:['id','name']
                }
              ]
        });

        transactions = transactions.map(t => {
            return {
                ...t.toJSON(),
                currency: t.transactionCurrency,
                type: t.transactionType,
                category: t.transactionCategory,
                payment_method: t.transactionPaymenMethod
            };
        });
        
        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            page,
            items: transactions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/summary', async (req, res) => {
    try {
        const now = new Date(); // Fecha actual
        const year = now.getFullYear(); // Año actual
        const month = now.getMonth(); // Mes actual (0 = enero, 1 = febrero, ..., 11 = diciembre)

        // Primer día del mes actual
        const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
        firstDayOfMonth.setUTCHours(0, 0, 0, 0); // Asegurar que sea a las 00:00:00 en UTC

        // Último día del mes actual
        const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
        lastDayOfMonth.setUTCHours(23, 59, 59, 999); // Asegurar que sea a las 23:59:59.999 en UTC
        console.log(firstDayOfMonth, lastDayOfMonth);

        const { Op } = require('sequelize');

        let summary = await Transaction.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'],
                [Sequelize.col('transactionCurrency.symbol'),'currency'],
                [Sequelize.col('transactionType.name'), 'typeName']
            ],
            where: {
                date: {
                    [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                }
            },
            include: [
                {
                    model: Types,  // Asegúrate de que `Type` es el modelo correcto
                    as: 'transactionType',   // Debe coincidir con el alias definido en la relación
                    attributes: []
                },
                {
                    model: Currency,  // Asegúrate de que `Type` es el modelo correcto
                    as: 'transactionCurrency',   // Debe coincidir con el alias definido en la relación
                    attributes: []
                }
            ],
            group: ['transactionCurrency.symbol', 'transactionType.name']
        });

        const balance = await transactionService.getBalancePorMoneda();
        console.log(balance);
        console.log(summary);


        const summary_general = {
            summary,
            balance
        }
        res.json(summary_general);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        let { id, name, description, date, amount, category, payment_method, type, currency } = req.body;

        // Validar datos requeridos
        if (!name || !description || !date || !amount || !category || !payment_method || !type || !currency) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        let transaction;

        if (id) {
            // Intentar encontrar el transaction existente
            transaction = await Transaction.findByPk(id);
            if (!transaction) {
                return res.status(404).json({ error: 'transaction no encontrado' });
            }

            // Actualizar el transaction existente
            category = category.id
            currency = currency.id
            type = type.id
            payment_method = payment_method.id
            await Transaction.update({ name, description, date, amount, category_id: category.id,
                payment_method_id: payment_method.id, type_id: type, currency_id: currency.id },
                { where: { id } }
            );
            res.status(200).json({ message: 'transaction actualizado correctamente' });
        } else {
            // Crear un nuevo transaction

            transaction = await Transaction.create({ name, description, date, amount, category_id: category.id,
                payment_method_id: payment_method.id, type_id: type.id, currency_id: currency.id });
            res.status(201).json({ message: 'transaction creado correctamente', transaction });
        }
    } catch (error) {
        console.error('Error al procesar el transaction:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.update(req.body);
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.destroy();
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;