const bcrypt = require('bcrypt');

const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/users');
const tokenAuth = require('../middleware/auth');

router.get('/me', tokenAuth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

/* CREATE USER */
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /* CHECK IF USER ALREADY EXISTS */
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('The user already registered');

  user = new User({
    ...req.body,
  });
  /* PASSWORD HASHING */
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  /* CREATE WEB TOKEN */
  const token = user.generateAuthToken();

  res.header('x-auth-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

module.exports = router;
