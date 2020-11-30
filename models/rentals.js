const Joi = require('joi');
const mongoose = require('mongoose');

/* RENTAL SCHEMA */
const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      isGold: {
        type: Boolean,
        default: false,
      },
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    require: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

/* ADD RENTAL STATIC METHOD */
rentalSchema.statics.lookup = function (customerId, movieId) {
  /* RETRIEVE RENTAL */
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
};

/* RENTAL MODEL */
const Rental = mongoose.model('Rental', rentalSchema);

/* JOI VALIDATION */
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
