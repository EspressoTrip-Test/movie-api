const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');

/* MIDDLEWARES */
const tokenAuth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const validate = require('../middleware/validate');

/* ALL GENRE */
router.get('/', async (req, res) => {
  const results = await Genre.find().sort('name');
  res.send(results);
});

/* GET A GENRE */
router.get('/:id', async (req, res) => {
  const result = await Genre.findById(req.params.id);
  if (!result) return res.status(404).send('A genre with that ID cannot be found');
  res.send(result);
});

/* ADD GENRE*/
router.post('/', [tokenAuth, adminAuth, validate(validateGenre)], async (req, res) => {
  const newGenre = new Genre(req.body);
  const genre = await newGenre.save();
  res.send(genre);
});

/* MODIFY GENRE */
router.put('/:id', [tokenAuth, adminAuth, validate(validateGenre)], async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send('The ID of that genre does not exist.');
  res.send(genre);
});

/* DELETE GENRE*/
router.delete('/:id', [tokenAuth, adminAuth], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send('The ID of that genre does not exist.');
  res.send(genre);
});

module.exports = router;
