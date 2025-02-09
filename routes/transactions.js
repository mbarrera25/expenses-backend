const express = require('express');
const router = express.Router();

const Transaction = require("../models/Transaction");


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: transactions } = await Transaction.findAndCountAll({
            limit,
            offset,
            order: [['date', 'DESC']],
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
        const { id, name, description, date, amount, category, payment_method, type_transaction, currency } = req.body;

        // Validar datos requeridos
        if (!name || !description || !date || !amount || !category || !payment_method || !type_transaction || !currency) {
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
            await Transaction.update({ name, description, date, amount, category, payment_method, type_transaction, currency });
            res.status(200).json({ message: 'transaction actualizado correctamente', expense });
        } else {
            // Crear un nuevo transaction

            transaction = await Transaction.create({ name, description, date, amount, category, payment_method, type_transaction, currency });
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