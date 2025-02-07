const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.limit) || 10; // Elementos por página, por defecto 10
    const offset = (page - 1) * limit; // Calcula el desplazamiento

    const { count, rows: expenses } = await Expense.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Ordenar por fecha de creación descendente
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      items: expenses,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, date, amount, category, paymentMethod } = req.body;

    // Validar datos requeridos
    if (!name || !description || !date || !amount || !category || !paymentMethod) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Crear el gasto
    const expense = await Expense.create({ name, description, date, amount, category, paymentMethod });
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error al crear gasto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el gasto
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    // Eliminar el gasto
    await expense.destroy();
    res.json({ message: 'Gasto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
