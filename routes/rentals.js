const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

const { Rental, validateRental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customer');

/* MIDDLEWARES */
const tokenAuth = require('../middleware/auth');
const validate = require('../middleware/validate');

/* GET ALL RENTALS */
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('dateOut');
  res.send(rentals);
});

/* GET A RENTAL */
router.get('/:id', tokenAuth, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(400).send('The ID of that rental does not exist');
});

/* CREATE RENTAL */
router.post('/', validate(validateRental), async (req, res) => {
  /* CUSTOMER REQUEST VALIDATION */
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer ID');

  /* MOVIE REQUEST VALIDATION */
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie ID');

  if (movie.numberInStock === 0) return res.status(400).send('Movie is not available');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  new Fawn.Task()
    .save('rentals', rental)
    .update(
      'movies',
      { _id: movie._id },
      {
        $inc: {
          numberInStock: -1,
        },
      }
    )
    .run();
  res.send(rental);
});

module.exports = router;
