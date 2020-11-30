const express = require('express');
const app = express();
const winston = require('winston');

/* LOGGER */
require('./startup/logger')();

/* ADD OBJECT VALIDATION TO JOI */
require('./startup/validation')();

/* ROUTES */
require('./startup/routes')(app);

/* DATABASE */
require('./startup/database')();

/* CONFIG ENVIRONMENT VARIABLE CHECK */
require('./startup/config')();

/* INITIATE FAWN FOR 2 PHASE COMMITS */
require('./startup/fawn')();

/* PRODUCTION MIDDLEWARE */
require('./startup/prod')(app);

/* SERVER LISTENER */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server listening on ${port}`);
});
