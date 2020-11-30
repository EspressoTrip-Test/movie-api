const express = require('express');
const router = express.Router();
const { Customer, validateCustomer } = require('../models/customer');

/* MIDDLEWARES */
const validate = require('../middleware/validate');

/* GET ALL CUSTOMERS */
router.get('/', async (req, res, next) => {
  try {
    const customers = await Customer.find().sort('name');
    res.send(customers);
  } catch (err) {
    next(err);
  }
});

/* CREATE NEW CUSTOMER */
router.post('/', validate(validateCustomer), async (req, res) => {
  const customer = new Customer(req.body);

  await customer.save();
  res.send(customer);
});

/* GET CUSTOMER */
router.get('/:customerId', async (req, res) => {
  const customer = await Customer.findById(req.params.customerId);
  if (!customer) return res.status(404).send('Customer with that ID not found');
  res.send(customer);
});

/* UPDATE CUSTOMER */
router.put('/:customerId', validate(validateCustomer), async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.customerId,
    {
      ...req.body,
    },
    { new: true }
  );
  res.send(customer);
});

/* DELETE CUSTOMER */
router.delete('/:customerId', async (req, res) => {
  const result = await Customer.findByIdAndDelete(req.params.customerId);
  res.send(result);
});

module.exports = router;
