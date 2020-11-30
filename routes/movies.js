const express = require('express');
const router = express.Router();
const { validateMovie, Movie } = require('../models/movies');
const { Genre } = require('../models/genre');

/* MIDDLEWARES */
const tokenAuth = require('../middleware/auth');
const validate = require('../middleware/validate');

/* GET ALL MOVIES */
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

/* GET A MOVIES */
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res, status(400).send('The ID of that movie does not exist');
  res.send(movie);
});

/* CREATE MOVIE */
router.post('/', [tokenAuth, validate(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});

/* UPDATE MOVIE */
router.put('/:id', [tokenAuth, validate(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  res.send(movie);
});

/* DELETE MOVIE */
router.delete('/:id', tokenAuth, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(400).send('The ID of that movie does not exist.');
  res.send(movie);
});

module.exports = router;
