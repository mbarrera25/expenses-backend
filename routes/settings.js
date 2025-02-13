const express = require('express');
const router = express.Router();
const Types = require('../models/Types');
const Categories = require('../models/Categories');
const PaymentMethods = require('../models/PaymentMethods');
const Currency = require('../models/Currency');
const UtilService = require('../services/utils.service')
const utilsService = new UtilService()
router.get('/', async (req, res) => {
    try {
        const types = await Types.findAll();
        const categories = utilsService.renameKeyInResults(await Categories.findAll({
            include: [
                {
                    model: Types,
                    as: 'CategoryTypes',
                    attributes: ['id', 'name']
                }
            ]
        }),'CategoryTypes','type');
        const paymentMethods = utilsService.renameKeyInResults(await PaymentMethods.findAll({
            include: [
                {
                    model: Currency,
                    as: 'PaymentMethodCurrency',
                    attributes: ['id', 'name', 'code', 'symbol']
                }
            ]
        }), 'PaymentMethodCurrency', 'currency');
        const currency = await Currency.findAll();
        res.json({
            types,
            categories,
            paymentMethods,
            currency
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/types', async (req, res) => {
    try {
        const { name, operation, description } = req.body;
        if (!name || !operation || !description) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const type = await Types.create({ name, operation, description });
        res.status(201).json(type);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/categories', async (req, res) => {
    try {
        let { name, type } = req.body;
        console.log(req.body);

        if (!name, !type) {
            return res.status(400).json({ error: 'all arguments is required' });
        }

        const category = await Categories.create({ name, type_id: type.id });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/payment-methods', async (req, res) => {
    try {
        let { name, currency } = req.body;
        if (!name || !currency) {
            return res.status(400).json({ error: 'Name is required' });
        }        
        const paymentMethod = await PaymentMethods.create({ name, currency_id: currency.id });
        res.status(201).json(paymentMethod);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/currency', async (req, res) => {
    try {
        const { name, symbol, code } = req.body;
        if (!name || !symbol || !code) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const currency = await Currency.create({ name, symbol, code });
        res.status(201).json(currency);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/types/:id', async (req, res) => {
    try {
        const type = await Types.findByPk(req.params.id);
        if (!type) {
            return res.status(404).json({ message: 'Type not found' });
        }
        await type.update(req.body);
        res.json(type);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.update({...req.body, type_id: req.body.type.id});
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/payment-methods/:id', async (req, res) => {
    try {
        const paymentMethod = await PaymentMethods.findByPk(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        await paymentMethod.update({...req.body, currency_id: req.body.currency.id});
        res.json(paymentMethod);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/currency/:id', async (
    req, res) => {
    try {
        const currency = await Currency.findByPk(req.params.id);
        if (!currency) {
            return res.status(404).json({ message: 'Currency not found' });
        }
        await currency.update(req.body);
        res.json(currency);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
);

router.delete('/types/:id', async (req, res) => {
    try {
        const type = await Types.findByPk(req.params.id);
        if (!type) {
            return res.status(404).json({ message: 'Type not found' });
        }
        await type.destroy();
        res.json({ message: 'Type deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/payment-methods/:id', async (req, res) => {
    try {
        const paymentMethod = await PaymentMethods.findByPk(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        await paymentMethod.destroy();
        res.json({ message: 'Payment method deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/currency/:id', async (req, res) => {
    try {
        const currency = await Currency.findByPk(req.params.id);
        if (!currency) {
            return res.status(404).json({ message: 'Currency not found' });
        }
        await currency.destroy();
        res.json({ message: 'Currency deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;

