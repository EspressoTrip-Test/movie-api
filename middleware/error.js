const winston = require('winston');

function errorHandle(err, req, res, next) {
  winston.error(err.message);
  res.status(500).send('Something went wrong...');
}

module.exports = errorHandle;
