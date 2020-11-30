const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
function database() {
  /* CONNECT TO DB */
  const db = config.get('db');
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      winston.info(`Connected to database ${db}`);
    });
}

module.exports = database;
