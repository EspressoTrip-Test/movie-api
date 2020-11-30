const mongoose = require('mongoose');
const Joi = require('joi');

/* GENRE SCHEMA */
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

/* GENRE MODEL */
const Genre = new mongoose.model('Genre', genreSchema);

/* JOI VALIDATION */
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;
