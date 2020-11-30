const Joi = require('joi');
const mongoose = require('mongoose');

/* IMPORT GENRE MODEL */
const { genreSchema, Genre } = require('./genre');

/* MOVIE MODEL */
const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

/* JOI VALIDATION */
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });
  return schema.validate(movie);
}

exports.validateMovie = validateMovie;
exports.Movie = Movie;
