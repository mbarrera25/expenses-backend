const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.pageSize) || 10; // Elementos por página, por defecto 10
    const offset = (page - 1) * limit; // Calcula el desplazamiento

    const { count, rows: expenses } = await Expense.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Ordenar por fecha de creación descendente
    });

    const MonthCurrent = new Date().getMonth();
    const m =new Date(Date.UTC(new Date().getFullYear(), MonthCurrent, 1)); // Fecha de inicio del mes actual
    m.setHours(0,0,0,0); // Normalizar la fecha (eliminar horas, minutos, segundos y milisegundos)
    console.log('Fecha de inicio del mes actual', m);
    
    const allItems = await Expense.findAll({
      where: {
        date: {
          [Op.gt]: m, //Fecha de inicio del mes actual
        }
      }
    });

    allItems.map((item) => {
      console.log(item.date,item.amount);
    });

    const totalBudgeted = allItems.filter(item => {
      const today = new Date(); // Fecha actual
      today.setHours(0, 0, 0, 0); // Normalizar la fecha (eliminar horas, minutos, segundos y milisegundos)
      const date = new Date(item.date)
      date.setHours(0, 0, 0, 0)
      return date > today;
    }).reduce((acc, item) => acc + item.amount, 0);


    const totalToday= allItems.filter(item => {
      const today = new Date(); // Fecha actual
      today.setHours(0, 0, 0, 0); // Normalizar la fecha (eliminar horas, minutos, segundos y milisegundos)
      const date = new Date(item.date)
      date.setHours(0, 0, 0, 0)
      console.log(date.toISOString().split('T')[0], today.toISOString().split('T')[0])
      console.log(date.toISOString().split('T')[0] === today.toISOString().split('T')[0]);
      
         
      return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    }).reduce((acc, item) => acc + item.amount, 0);

    console.log('TotalToday', totalToday);
    
    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      items: expenses,
      totalMonth: allItems.reduce((acc, item) => acc + item.amount, 0),
      totalBudgeted: totalBudgeted,
      totalToday
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { id, name, description, date, amount, category, paymentMethod } = req.body;

    // Validar datos requeridos
    if (!name || !description || !date || !amount || !category || !paymentMethod) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    let expense;

    if (id) {
      // Intentar encontrar el gasto existente
      expense = await Expense.findByPk(id);
      if (!expense) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }

      // Actualizar el gasto existente
      await expense.update({ name, description, date, amount, category, paymentMethod });
      res.status(200).json({ message: 'Gasto actualizado correctamente', expense });
    } else {
      // Crear un nuevo gasto
      expense = await Expense.create({ name, description, date, amount, category, paymentMethod });
      res.status(201).json({ message: 'Gasto creado correctamente', expense });
    }
  } catch (error) {
    console.error('Error al procesar el gasto:', error);
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
