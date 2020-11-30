const bcrypt = require('bcrypt');
const Joi = require('joi');

const express = require('express');
const router = express.Router();

const { User } = require('../models/users');

/* MIDDLEWARES */
const validate = require('../middleware/validate');

/* AUTH USER */
router.post('/', validate(validateAuth), async (req, res) => {
  /* CHECK IF USER EXISTS */
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  /* CREATE JWT TOKEN */
  const token = user.generateAuthToken();
  res.send(token);
});

function validateAuth(req) {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
