const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Fawn = require('fawn');

const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');

/* MIDDLEWARES */
const tokenAuth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', [tokenAuth, validate(validateReturn)], async (req, res) => {
  const date = new Date();
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send('Rental not found');
  if (rental.dateReturned) return res.status(400).send('Rental has already been processed');

  /* RETRIEVE MOVIES */
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie ID');

  /* CALCULATE RENTAL DAYS */
  const days = Math.round((date - rental.dateOut) / 1000 / 3600 / 24);

  /* UPDATE MOVIE AND RENTAL */
  new Fawn.Task()
    .update(
      'rentals',
      { _id: rental._id },
      {
        $set: {
          dateReturned: date,
          rentalFee: days * movie.dailyRentalRate,
        },
      }
    )
    .update(
      'movies',
      { _id: movie._id },
      {
        $inc: {
          numberInStock: 1,
        },
      }
    )
    .run();

  res.send({
    customer: rental.customer.name,
    title: movie.title,
    rentalFee: days * movie.dailyRentalRate,
  });
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.string().min(5).max(50).required(),
    movieId: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(req);
}

module.exports = router;
